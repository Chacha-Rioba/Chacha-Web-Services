import {registerCrm} from './crm.js';
import {registerWorkspace} from './workspace.js';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { randomUUID,randomBytes,createHash } from 'node:crypto';
import { mkdirSync,readFileSync,unlinkSync,existsSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { z } from 'zod';
import { openStore } from './store.js';
import { briefSchema,contactSchema,estimate } from '../shared/validation.js';
import { projectStates } from '../shared/catalog.js';

const hash=v=>createHash('sha256').update(v).digest('hex');
const now=()=>new Date().toISOString();
const id=()=>randomUUID();
const fail=(status,message)=>Object.assign(new Error(message),{status});
export function createApp(config={}) {
  const dir=resolve(config.dataDir||process.env.DATA_DIR||'data');
  const origin=config.origin||process.env.APP_ORIGIN||'http://localhost:5173';
  const production=process.env.NODE_ENV==='production';
  const devLinks=!production&&(config.devLinks??process.env.DEV_AUTH_LINKS==='true');
  const admins=(config.admins||process.env.ADMIN_EMAILS||'').toLowerCase().split(',').map(x=>x.trim());
  const db=openStore(dir), app=express();
  const stmt=sql=>db.prepare(sql);
  const audit=(actor,action,entity,details={})=>stmt('INSERT INTO audit(actor,action,entity,details,created) VALUES(?,?,?,?,?)').run(actor,action,entity,JSON.stringify(details),now());
  const enqueue=(recipient,subject,body)=>{if(recipient)stmt('INSERT INTO outbox(id,recipient,subject,body) VALUES(?,?,?,?)').run(id(),recipient,subject,body);};
  const mailReady=!!(process.env.SMTP_HOST&&process.env.MAIL_FROM);
  app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],imgSrc:["'self'","data:"],styleSrc:["'self'","'unsafe-inline'"],scriptSrc:["'self'"],connectSrc:["'self'"],frameAncestors:["'none'"]}}}));
  app.use(express.json({limit:'120kb'}));
  app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store'); if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.headers.origin!==origin)return res.status(403).json({error:'This request must come from the CWS website.'});next();});
  const limiter=(limit,windowMs=60*60*1000)=>rateLimit({windowMs,limit,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many attempts. Please try again later.'}});
  app.use('/api',limiter(300,15*60*1000));
  app.use('/api',(req,res,next)=>{
    const value=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('cws_session='))?.slice(12);
    if(value){const user=stmt('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.expires>?').get(hash(value),Date.now());if(user)req.user={...user,role:admins.includes(user.email)?'admin':'client'};}
    next();
  });
  const auth=(req,res,next)=>req.user?next():res.status(401).json({error:'Sign in to continue.'});
  const admin=(req,res,next)=>req.user?.role==='admin'?next():res.status(403).json({error:'Administrator access required.'});
  const project=(req)=>{const p=stmt('SELECT * FROM projects WHERE id=?').get(req.params.id);if(!p||(req.user.role!=='admin'&&p.email!==req.user.email))throw fail(404,'Project not found.');return p;};
  const serialize=p=>({...p,brief:JSON.parse(p.brief),checks:JSON.parse(p.checks||'[]')});
  app.get('/api/config',(req,res)=>res.json({contactEmail:process.env.PUBLIC_CONTACT_EMAIL||null,authReady:mailReady||devLinks,uploads:'quarantined',payments:'manual',version:'0.1.0'}));
  app.get('/api/health',(req,res)=>{stmt('SELECT 1').get();res.json({ok:true});});
  app.get('/api/me',(req,res)=>res.json({user:req.user?{name:req.user.name,email:req.user.email,role:req.user.role}:null}));
  app.post('/api/auth/request',limiter(8),async(req,res)=>{
    const {email}=z.object({email:z.string().trim().email().max(254).transform(v=>v.toLowerCase())}).parse(req.body);
    if(!mailReady&&!devLinks)throw fail(503,'Secure email sign-in is not configured yet. Please contact CWS.');
    const token=randomBytes(32).toString('hex');stmt('INSERT INTO tokens VALUES(?,?,?)').run(hash(token),email,Date.now()+15*60*1000);
    const link=`${origin}/verify#token=${token}`;
    enqueue(email,'Your CWS sign-in link',`Use this single-use link within 15 minutes to sign in to Chacha Web Services:\n${link}\nIf you did not request it, ignore this email.`);
    res.json({message:'Check your email for a secure sign-in link.',...(devLinks?{developmentLink:link}:{})});
  });
  app.post('/api/auth/signup',limiter(8),(req,res)=>{
    const v=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase())}).parse(req.body);
    if(!mailReady&&!devLinks)throw fail(503,'Secure email verification is not configured yet. Please contact CWS.');
    const token=randomBytes(32).toString('hex'),digest=hash(token),link=origin+'/verify#token='+token;
    db.exec('BEGIN IMMEDIATE');try{stmt('INSERT INTO tokens VALUES(?,?,?)').run(digest,v.email,Date.now()+15*60*1000);stmt('INSERT INTO registrations VALUES(?,?)').run(digest,v.name);enqueue(v.email,'Verify your CWS account','Verify your email within 15 minutes to activate your account: '+link);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
    res.json({message:'Check your email to verify your account.',...(devLinks?{developmentLink:link}:{})});
  });
  app.post('/api/auth/verify',limiter(30),(req,res)=>{
    const {token}=z.object({token:z.string().regex(/^[a-f0-9]{64}$/)}).parse(req.body);
    const record=stmt('SELECT * FROM tokens WHERE hash=? AND expires>?').get(hash(token),Date.now());if(!record)throw fail(400,'This link has expired or was already used. Request another link.');
    db.exec('BEGIN IMMEDIATE');
    try{const registration=stmt('SELECT name FROM registrations WHERE token_hash=?').get(hash(token));stmt('DELETE FROM registrations WHERE token_hash=?').run(hash(token));stmt('DELETE FROM tokens WHERE hash=?').run(hash(token));stmt('INSERT OR IGNORE INTO users VALUES(?,?,?,?)').run(id(),record.email,registration?.name||record.email.split('@')[0],now());db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
    const user=stmt('SELECT * FROM users WHERE email=?').get(record.email),session=randomBytes(32).toString('hex');
    stmt('INSERT INTO sessions VALUES(?,?,?)').run(hash(session),user.id,Date.now()+7*86400000);
    res.setHeader('Set-Cookie',`cws_session=${session}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${production?'; Secure':''}`);
    res.json({role:admins.includes(record.email)?'admin':'client'});
  });
  app.post('/api/auth/logout',(req,res)=>{const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('cws_session='))?.slice(12);if(token)stmt('DELETE FROM sessions WHERE hash=?').run(hash(token));res.setHeader('Set-Cookie','cws_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');res.json({ok:true});});
  app.post('/api/estimates',(req,res)=>res.json(estimate(req.body)));
  mkdirSync(join(dir,'uploads'),{recursive:true});
  const upload=multer({dest:join(dir,'uploads'),limits:{fileSize:20*1024*1024,files:1}});
  app.post('/api/uploads',limiter(30),upload.single('file'),(req,res)=>{
    if(!req.file)throw fail(400,'Choose a file.');
    try{
      const key=z.string().uuid().parse(req.headers['x-draft-key']);
      const b=readFileSync(req.file.path),ext=req.file.originalname.split('.').pop().toLowerCase();
      const valid=(ext==='png'&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||(['jpg','jpeg'].includes(ext)&&b[0]===255&&b[1]===216)|| (ext==='webp'&&b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP')||(ext==='pdf'&&b.subarray(0,5).toString()==='%PDF-')||(ext==='txt'&&!b.includes(0));
      if(!valid)throw fail(400,'Use a valid PNG, JPG, WEBP, PDF or plain text file.');
      const totals=stmt('SELECT COUNT(*) AS count,COALESCE(SUM(size),0) AS size FROM uploads WHERE owner_hash=? AND project_id IS NULL').get(hash(key));
      if(totals.count>=10||totals.size+req.file.size>100*1024*1024)throw fail(400,'Draft limit: 10 files and 100 MB total.');
      const uid=id();stmt('INSERT INTO uploads(id,owner_hash,name,path,size,mime,created) VALUES(?,?,?,?,?,?,?)').run(uid,hash(key),req.file.originalname.slice(0,200),req.file.path,req.file.size,req.file.mimetype,now());res.status(201).json({id:uid,name:req.file.originalname,state:'Quarantined',size:req.file.size});
    }catch(e){unlinkSync(req.file.path);throw e;}
  });
  app.post('/api/briefs',limiter(12),(req,res)=>{
    const key=z.string().uuid().parse(req.headers['idempotency-key']),brief=briefSchema.parse(req.body),digest=hash(JSON.stringify(brief));
    const existing=stmt('SELECT * FROM requests WHERE key=?').get(key);
    if(existing){if(existing.hash!==digest)throw fail(409,'This submission key was already used. Start a new brief.');const p=stmt('SELECT reference FROM projects WHERE id=?').get(existing.project_id);return res.json({reference:p.reference,duplicate:true});}
    const draftKey=z.string().uuid().parse(req.headers['x-draft-key']);
    for(const uid of brief.uploadIds){const file=stmt('SELECT * FROM uploads WHERE id=? AND owner_hash=? AND project_id IS NULL').get(uid,hash(draftKey));if(!file)throw fail(400,'An attachment is no longer available. Remove it and upload it again.');}
    const pid=id(),reference=`CWS-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    db.exec('BEGIN IMMEDIATE');
    try{
      stmt('INSERT INTO projects(id,reference,email,name,brief,created,updated) VALUES(?,?,?,?,?,?,?)').run(pid,reference,brief.business.email,brief.business.name,JSON.stringify(brief),now(),now());
      stmt('INSERT INTO leads(id,project_id) VALUES(?,?)').run(id(),pid);stmt('INSERT INTO orders(id,project_id,package) VALUES(?,?,?)').run(id(),pid,brief.package);
      for(const uid of brief.uploadIds)stmt('UPDATE uploads SET project_id=? WHERE id=?').run(pid,uid);
      stmt('INSERT INTO requests VALUES(?,?,?)').run(key,digest,pid);
      enqueue(brief.business.email,`CWS brief received · ${reference}`,`Your project brief for ${brief.business.name} has been received. Reference: ${reference}. Sign in at ${origin}/login with this email to follow progress. Work begins after scope and readiness are confirmed.`);
      enqueue(process.env.STAFF_EMAIL,'New CWS project brief',`A new brief is ready for review: ${reference}. Open ${origin}/admin.`);
      audit('visitor','brief.submitted',pid,{reference});db.exec('COMMIT');
    }catch(e){db.exec('ROLLBACK');throw e;}
    res.status(201).json({reference});
  });
  app.post('/api/contact',limiter(8),(req,res)=>{const value=contactSchema.parse(req.body);stmt('INSERT INTO inquiries VALUES(?,?,?)').run(id(),JSON.stringify(value),now());enqueue(process.env.STAFF_EMAIL,'New CWS inquiry',`A contact inquiry is ready in CWS Admin.`);res.status(201).json({message:'Your inquiry has been received.'});});
  app.get('/api/projects',auth,(req,res)=>{const rows=req.user.role==='admin'?stmt('SELECT * FROM projects ORDER BY created DESC').all():stmt('SELECT * FROM projects WHERE email=? ORDER BY created DESC').all(req.user.email);res.json({projects:rows.map(serialize)});});
  app.get('/api/projects/:id',auth,(req,res)=>{
    const p=project(req);res.json({project:serialize(p),messages:stmt('SELECT m.*,u.name FROM messages m JOIN users u ON u.id=m.user_id WHERE project_id=? ORDER BY m.created').all(p.id),files:stmt('SELECT id,name,size,state,created FROM uploads WHERE project_id=?').all(p.id),invoices:stmt('SELECT * FROM invoices WHERE project_id=? ORDER BY created DESC').all(p.id),deliverables:stmt('SELECT * FROM deliverables WHERE project_id=? ORDER BY created DESC').all(p.id),services:stmt('SELECT * FROM service_records WHERE project_id=?').all(p.id),order:stmt('SELECT * FROM orders WHERE project_id=?').get(p.id)});
  });
  app.post('/api/projects/:id/messages',auth,(req,res)=>{const p=project(req);const {body}=z.object({body:z.string().trim().min(1).max(3000)}).parse(req.body);stmt('INSERT INTO messages VALUES(?,?,?,?,?)').run(id(),p.id,req.user.id,body,now());enqueue(req.user.role==='admin'?p.email:process.env.STAFF_EMAIL,'New CWS project message',`A project message is ready. Sign in at ${origin}/portal.`);res.status(201).json({ok:true});});
  app.patch('/api/projects/:id',auth,admin,(req,res)=>{
    const p=project(req);const v=z.object({status:z.enum(projectStates),version:z.number().int(),checks:z.array(z.enum(['Branding','UI Design','Development','Client Review','Changes','Ready','Live'])).default([])}).parse(req.body);
    if(v.status==='Live')throw fail(400,'Live status requires the launch verification workflow; it is not enabled in this release.');
    if(v.status==='Completed'){const latest=stmt('SELECT status FROM deliverables WHERE project_id=? ORDER BY version DESC LIMIT 1').get(p.id);if(!v.checks.includes('Ready')||(latest&&latest.status!=='Approved'))throw fail(400,'Complete the Ready milestone and obtain approval of the latest shared design before completing delivery.');}
    const weights={'Branding':15,'UI Design':25,'Development':35,'Client Review':10,'Changes':5,'Ready':5,'Live':5};
    const progress=v.status==='Completed'?100:[...new Set(v.checks)].filter(x=>x!=='Live').reduce((sum,x)=>sum+weights[x],0);
    const r=stmt('UPDATE projects SET status=?,progress=?,checks=?,version=version+1,updated=? WHERE id=? AND version=?').run(v.status,progress,JSON.stringify([...new Set(v.checks)].filter(x=>x!=='Live')),now(),p.id,v.version);if(!r.changes)throw fail(409,'The project changed. Refresh before saving.');audit(req.user.email,'project.updated',p.id,{status:v.status,checks:v.checks});res.json({ok:true});
  });
  app.post('/api/projects/:id/deliverables',auth,admin,(req,res)=>{const p=project(req),v=z.object({title:z.string().trim().min(3).max(150),url:z.string().url().refine(v=>v.startsWith('https://'),'Use HTTPS')}).parse(req.body);const version=Number(stmt('SELECT COALESCE(MAX(version),0) AS v FROM deliverables WHERE project_id=?').get(p.id).v)+1;stmt('INSERT INTO deliverables(id,project_id,title,url,version,created) VALUES(?,?,?,?,?,?)').run(id(),p.id,v.title,v.url,version,now());enqueue(p.email,'Your CWS design is ready for review',`Sign in at ${origin}/portal to review the latest design.`);res.status(201).json({ok:true});});
  app.post('/api/projects/:id/approvals',auth,(req,res)=>{const p=project(req);if(req.user.role==='admin')throw fail(403,'Only the client can approve a design.');const v=z.object({id:z.string().uuid(),status:z.enum(['Approved','Changes requested']),feedback:z.string().max(2000).default('')}).parse(req.body);if(v.status==='Changes requested'&&!v.feedback.trim())throw fail(400,'Describe the changes you need.');const d=stmt('SELECT * FROM deliverables WHERE id=? AND project_id=?').get(v.id,p.id);if(!d)throw fail(404,'Design not found.');const latest=stmt('SELECT MAX(version) AS v FROM deliverables WHERE project_id=?').get(p.id);if(d.version!==latest.v||d.status!=='Awaiting review')throw fail(409,'This design has already been reviewed or replaced. Refresh to view the latest version.');stmt('UPDATE deliverables SET status=?,feedback=? WHERE id=?').run(v.status,v.feedback,d.id);audit(req.user.email,'deliverable.reviewed',d.id,{version:d.version,status:v.status});res.json({ok:true});});
  app.post('/api/projects/:id/invoices',auth,admin,(req,res)=>{const p=project(req),v=z.object({description:z.string().min(3).max(300),currency:z.enum(['KES','USD']),total:z.number().int().positive().max(1e10),due_date:z.string().default('').refine(v=>!v||(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v&&v>=now().slice(0,10)),'Due date must be a valid date on or after issue date')}).parse(req.body);stmt('INSERT INTO invoices(id,project_id,description,currency,total,created,due_date) VALUES(?,?,?,?,?,?,?)').run(id(),p.id,v.description,v.currency,v.total,now(),v.due_date);audit(req.user.email,'invoice.created',p.id,v);res.status(201).json({ok:true});});
  app.post('/api/invoices/:id/payments',auth,admin,(req,res)=>{
    const inv=stmt('SELECT * FROM invoices WHERE id=?').get(req.params.id);if(!inv)throw fail(404,'Invoice not found.');const v=z.object({amount:z.number().int().positive(),reference:z.string().trim().min(3).max(100)}).parse(req.body);
    const old=stmt('SELECT * FROM payments WHERE reference=?').get(v.reference);if(old){if(old.invoice_id===inv.id&&old.amount===v.amount)return res.json({ok:true,duplicate:true});throw fail(409,'Payment reference already belongs to another payment.');}
    if(inv.paid+v.amount>inv.total)throw fail(409,'Payment exceeds the outstanding balance. Review the amount.');db.exec('BEGIN IMMEDIATE');try{stmt('INSERT INTO payments VALUES(?,?,?,?,?)').run(id(),inv.id,v.amount,v.reference,now());stmt('UPDATE invoices SET paid=paid+?,status=? WHERE id=?').run(v.amount,inv.paid+v.amount===inv.total?'Paid':'Partially paid',inv.id);audit(req.user.email,'payment.recorded',inv.id,v);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}res.json({ok:true});
  });
  app.post('/api/projects/:id/services',auth,admin,(req,res)=>{const p=project(req),v=z.object({type:z.enum(['Domain','Hosting','Business email','Maintenance']),label:z.string().min(2).max(200),status:z.enum(['Requested','Awaiting access','Active','Expiring','Expired','Cancelled']),renewal:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')).default(''),details:z.string().max(2000).default('')}).parse(req.body);stmt('INSERT INTO service_records VALUES(?,?,?,?,?,?,?)').run(id(),p.id,v.type,v.label,v.status,v.renewal||null,v.details);res.status(201).json({ok:true});});
  app.get('/api/tickets',auth,(req,res)=>res.json({tickets:req.user.role==='admin'?stmt('SELECT * FROM tickets ORDER BY created DESC').all():stmt('SELECT * FROM tickets WHERE email=? ORDER BY created DESC').all(req.user.email)}));
  app.post('/api/tickets',auth,(req,res)=>{const v=z.object({subject:z.string().trim().min(5).max(150),body:z.string().trim().min(20).max(3000)}).parse(req.body);stmt('INSERT INTO tickets(id,email,subject,body,created) VALUES(?,?,?,?,?)').run(id(),req.user.email,v.subject,v.body,now());enqueue(process.env.STAFF_EMAIL,'New support request',`A support request is ready in CWS Admin.`);res.status(201).json({ok:true});});
  app.patch('/api/tickets/:id',auth,admin,(req,res)=>{const {status}=z.object({status:z.enum(['Open','In progress','Waiting for client','Resolved'])}).parse(req.body);if(!stmt('UPDATE tickets SET status=? WHERE id=?').run(status,req.params.id).changes)throw fail(404,'Ticket not found.');res.json({ok:true});});
  app.get('/api/admin/overview',auth,admin,(req,res)=>res.json({orders:stmt('SELECT o.*,p.name,p.reference FROM orders o JOIN projects p ON p.id=o.project_id ORDER BY p.created DESC').all(),inquiries:stmt('SELECT * FROM inquiries ORDER BY created DESC').all().map(v=>({...v,body:JSON.parse(v.body)})),notifications:stmt('SELECT id,subject,state,attempts FROM outbox ORDER BY rowid DESC LIMIT 50').all(),audit:stmt('SELECT actor,action,created FROM audit ORDER BY id DESC LIMIT 50').all()}));
  registerCrm(app,{db,auth,admin,admins,audit});
  registerWorkspace(app,{db,auth,admin,project,serialize,audit,enqueue,admins,mailReady,devLinks});
  const dist=resolve('dist');if(existsSync(dist)){app.use(express.static(dist));app.get('/{*path}',(req,res,next)=>req.path.startsWith('/api/')?next():res.sendFile(join(dist,'index.html')));}
  app.use('/api',(req,res)=>res.status(404).json({error:'Not found.'}));
  app.use((err,req,res,next)=>{if(err instanceof z.ZodError)return res.status(400).json({error:'Please check the highlighted information.',fields:err.errors.map(e=>({path:e.path.join('.'),message:e.message}))});if(err.code==='LIMIT_FILE_SIZE')return res.status(413).json({error:'Files must be 20 MB or smaller.'});res.status(err.status||500).json({error:err.status?err.message:'Something went wrong. Please try again.'});});
  const transport=mailReady?nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_PORT==='465',auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined}):null;
  let sending=false;
  async function flushMail(){if(!transport||sending)return;sending=true;try{for(const job of stmt("SELECT * FROM outbox WHERE state='Pending' AND next_try<=? LIMIT 10").all(Date.now())){try{await transport.sendMail({from:process.env.MAIL_FROM,to:job.recipient,subject:job.subject,text:job.body});stmt("UPDATE outbox SET state='Sent',body='' WHERE id=?").run(job.id);}catch{const attempt=job.attempts+1;stmt('UPDATE outbox SET attempts=?,next_try=?,state=? WHERE id=?').run(attempt,Date.now()+[60000,300000,1800000][Math.min(attempt-1,2)],attempt>=4?'Failed':'Pending',job.id);}}}finally{sending=false;}}
  return {app,db,flushMail};
}
