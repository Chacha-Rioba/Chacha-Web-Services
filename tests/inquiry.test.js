import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {prepareInquiry,sendInquiry,FORM_ENDPOINT,localDate} from '../shared/inquiry.js';
import {services} from '../shared/catalog.js';
const input={name:'Example Client',email:'client@example.test',company:'Example Ltd',phone:'',service:'AI Agents & Automation',message:'We would like an assistant for our approved knowledge base.',privacy:'on',_honey:''};
test('email forms validate data and meeting time without creating records',()=>{
 const p=prepareInquiry(input,'Project inquiry');assert.equal(p.email,input.email);assert.equal(p._subject,'CWS | Project inquiry');assert.equal(p._template,'table');assert.ok(!('password'in p));
 assert.throws(()=>prepareInquiry({...input,_honey:'spam'},'Project inquiry'));assert.throws(()=>prepareInquiry({...input,email:'invalid'},'Project inquiry'));assert.throws(()=>prepareInquiry({...input,privacy:''},'Project inquiry'));assert.throws(()=>prepareInquiry({...input,message:'short'},'Project inquiry'));
 const meeting={...input,preferred_date:'2099-01-01',preferred_time:'14:30',time_zone:'Africa/Nairobi'};assert.match(prepareInquiry(meeting,'Meeting request').booking_status,/awaiting confirmation/);assert.throws(()=>prepareInquiry({...meeting,preferred_date:'2026-02-31'},'Meeting request'));assert.throws(()=>prepareInquiry({...meeting,preferred_date:'2000-01-01'},'Meeting request'));assert.throws(()=>prepareInquiry({...meeting,time_zone:'MadeUp/Zone'},'Meeting request'));assert.throws(()=>prepareInquiry({...meeting,preferred_time:'25:01'},'Meeting request'));assert.equal(localDate(new Date(2026,8,30)),'2026-09-30');
});
test('only explicit provider acceptance succeeds; failures and activation never report success',async()=>{
 let captured;const good=async(url,options)=>{captured={url,options};return {ok:true,json:async()=>({success:'true'})}};assert.equal((await sendInquiry(input,'Project inquiry',good)).accepted,true);assert.equal(captured.url,FORM_ENDPOINT);assert.equal(JSON.parse(captured.options.body).email,input.email);assert.ok(!captured.options.headers.Authorization);
 for(const response of [{ok:false,data:{success:true}},{ok:true,data:{success:false}},{ok:true,data:{}},{ok:true,data:{success:true,message:'Please activate this form by confirming your email'}}])await assert.rejects(sendInquiry(input,'Project inquiry',async()=>({ok:response.ok,json:async()=>response.data})));
 await assert.rejects(sendInquiry(input,'Project inquiry',async()=>{throw Error('Network unavailable')}),/could not confirm/);
});
test('package is frontend-only, retiring the API and keeping service replacement',()=>{
 const p=JSON.parse(readFileSync(new URL('../package.json',import.meta.url)));assert.ok(!p.dependencies.express);assert.ok(!p.dependencies.nodemailer);assert.ok(!p.scripts.dev.includes('server'));assert.equal(existsSync(new URL('../server/app.js',import.meta.url)),false);assert.ok(services.some(s=>s[0]==='AI Agents & Automation'));assert.ok(!services.some(s=>s[0]==='Workflow automation'));
});
