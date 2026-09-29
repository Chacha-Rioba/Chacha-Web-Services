import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApp} from '../server/app.js';
import {reportCrm,csvRows} from '../shared/crm.js';
import {crmDemo} from '../shared/crm-demo.js';
test('CRM cohorts, date boundaries, distinct currencies and historical finance reconcile',()=>{
 const all=reportCrm(crmDemo);assert.equal(all.summary.registered,7);assert.equal(all.summary.submittedClients,6);assert.equal(all.summary.activeClients,2);
 const period={from:'2026-08-01',to:'2026-08-31'};const report=reportCrm(crmDemo,period);assert.equal(report.projects.length,3);assert.equal(reportCrm(crmDemo,{...period,cohort:'submitted'}).clients.length,report.summary.submittedClients);assert.equal(reportCrm(crmDemo,{...period,cohort:'active'}).clients.length,report.summary.activeClients);
 assert.equal(reportCrm(crmDemo,{from:'2026-07-10',to:'2026-07-10'}).projects.length,1);assert.equal(reportCrm(crmDemo,{stage:'Registered only'}).clients.length,1);assert.equal(reportCrm(crmDemo,{stage:'Has submitted'}).clients.length,6);assert.equal(reportCrm(crmDemo,{service:'Workflow automation'}).projects.length,1);
 for(const b of all.summary.billing){assert.equal(b.invoiced,b.paid+b.outstanding);assert.equal(b.paid,all.summary.collections.find(c=>c.currency===b.currency).amount)}
 assert.equal(reportCrm(crmDemo,{from:'2026-10-01',to:'2026-10-31'}).monthly[0].finance.KES.outstanding,10000000);assert.equal(all.summary.billing.length,2);const kes=reportCrm(crmDemo,{currency:'KES'});assert.equal(kes.summary.billing.length,1);assert.ok(kes.payments.every(p=>p.invoice.currency==='KES'));
 const july=all.monthly.find(m=>m.month==='2026-07');assert.equal(july.finance.KES.outstanding,8000000);const snapshot=reportCrm(crmDemo,{asOf:'2026-07-31',to:'2026-07-31',currency:'KES'});assert.equal(snapshot.summary.billing[0].outstanding,8000000);assert.equal(snapshot.invoices[0].paid,0);assert.equal(snapshot.payments.length,0);
 assert.equal(reportCrm(crmDemo,{search:'DEMO-2026-002'}).projects.length,1);assert.match(csvRows([['=SUM(1,2)','He said "yes"']]),/"'=SUM\(1,2\)","He said ""yes"""/);
});
test('CRM API protects client data, persists due dates, exports scoped records and validates completion',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'cws-crm-')),origin='http://localhost:5173';const{app,db}=createApp({dataDir:dir,origin,devLinks:true,admins:'project@cws.com'});const server=app.listen(0);await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
 const call=async(path,cookie,body,method=body?'POST':'GET')=>{const r=await fetch(base+'/api'+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}};
 const login=async email=>{const l=await call('/auth/request',null,{email});return(await call('/auth/verify',null,{token:new URL(l.data.developmentLink).hash.slice(7)})).cookie};
 try{
 const owner=await login('project@cws.com'),client=await login('brian@example.test');
 for(const p of crmDemo.projects)db.prepare('INSERT INTO projects(id,reference,email,name,brief,status,progress,created,updated) VALUES(?,?,?,?,?,?,?,?,?)').run(p.id,p.reference,p.email,p.name,JSON.stringify(p.brief),p.status,p.progress,p.created,p.updated);
 for(const i of crmDemo.invoices)db.prepare('INSERT INTO invoices(id,project_id,description,currency,total,paid,status,created,due_date) VALUES(?,?,?,?,?,?,?,?,?)').run(i.id,i.project_id,i.description,i.currency,i.total,i.paid,i.status,i.created,i.due_date);
 for(const p of crmDemo.payments)db.prepare('INSERT INTO payments VALUES(?,?,?,?,?)').run(p.id,p.invoice_id,p.amount,p.reference,p.created);
 assert.equal((await call('/admin/crm')).status,401);assert.equal((await call('/admin/crm',client)).status,403);assert.equal((await call('/admin/crm/clients/brian%40example.test',client)).status,403);
 assert.equal((await call('/admin/crm?from=2026-02-31',owner)).status,400);assert.equal((await call('/admin/crm?from=2026-10-01&to=2026-09-01',owner)).status,400);
 const selected=(await call('/admin/crm?status=Awaiting%20approval',owner)).data;assert.equal(selected.projects.length,1);assert.equal(selected.projects[0].email,'brian@example.test');assert.equal(selected.projects[0].balances[0].outstanding,2000000);
 const profile=(await call('/admin/crm/clients/brian%40example.test',owner)).data;assert.equal(profile.readOnly,true);assert.ok(profile.client.id);assert.equal(profile.projects.length,2);assert.ok(profile.projects.every(p=>p.email==='brian@example.test'));assert.equal(profile.invoices.length,1);
 const invoice=crmDemo.invoices[0];assert.equal((await call('/admin/crm/invoices/'+invoice.id,client,{due_date:'2026-12-01',version:1},'PATCH')).status,403);assert.equal((await call('/admin/crm/invoices/'+invoice.id,owner,{due_date:'2026-01-01',version:1},'PATCH')).status,400);assert.equal((await call('/admin/crm/invoices/'+invoice.id,owner,{due_date:'2026-12-01',version:1},'PATCH')).status,200);assert.equal((await call('/admin/crm/invoices/'+invoice.id,owner,{due_date:'2026-12-02',version:1},'PATCH')).status,409);
 assert.equal(db.prepare('SELECT due_date FROM invoices WHERE id=?').get(invoice.id).due_date,'2026-12-01');
 const csv=await fetch(base+'/api/admin/crm/export/invoices?currency=USD',{headers:{Cookie:owner}});assert.equal(csv.status,200);const text=await csv.text();assert.ok(text.includes('USD'));assert.ok(!text.includes('KES'));assert.match(csv.headers.get('content-disposition'),/attachment/);
 const p=crmDemo.projects[3];assert.equal((await call('/projects/'+p.id,owner,{status:'Completed',version:1,checks:[]},'PATCH')).status,400);assert.equal((await call('/projects/'+p.id,owner,{status:'Completed',version:1,checks:['Ready']},'PATCH')).status,200);assert.equal((await call('/projects/'+p.id,owner)).data.project.progress,100);
 await call('/projects/'+p.id+'/deliverables',owner,{title:'Final design review',url:'https://example.com/review'});assert.equal((await call('/projects/'+p.id,owner,{status:'Completed',version:2,checks:['Ready']},'PATCH')).status,400);
 const due='2099-01-01';assert.equal((await call('/projects/'+p.id+'/invoices',owner,{description:'Final handover',currency:'KES',total:10000,due_date:due})).status,201);assert.equal(db.prepare('SELECT due_date FROM invoices WHERE project_id=?').get(p.id).due_date,due);
 }finally{await new Promise(r=>server.close(r));db.close();rmSync(dir,{recursive:true,force:true})}
});
