export const displayStatus = p => p.awaiting_approval&&!['Cancelled','Completed','Live','On hold'].includes(p.status) ? 'Awaiting approval' : ({New:'Submitted',Assigned:'Pending',Designing:'In progress',Development:'In progress','Client Review':'Awaiting approval',Changes:'In progress',Ready:'Pending',Live:'Completed'}[p.status]||p.status);
export const paymentState = invoices => !invoices.length ? 'Unbilled' : invoices.every(i=>i.paid>=i.total)?'Paid':invoices.some(i=>i.paid>0)?'Partially paid':'Unpaid';
export const invoiceStatus = (i,today=new Date().toISOString().slice(0,10)) => i.paid>=i.total?'Paid':i.due_date&&i.due_date<today?'Overdue':i.paid>0?'Partially paid':'Unpaid';
export function totals(rows){return Object.values(rows.reduce((out,i)=>{const x=out[i.currency]??={currency:i.currency,invoiced:0,paid:0,outstanding:0};x.invoiced+=i.total;x.paid+=i.paid;x.outstanding+=i.total-i.paid;return out},{}))}
const between=(date,f)=>!!date&&(!f.from||date.slice(0,10)>=f.from)&&(!f.to||date.slice(0,10)<=f.to);
const textMatch=(values,search)=>values.join(' ').toLowerCase().includes((search||'').toLowerCase());
export function enrichCrm(data){
 const projects=data.projects.map(p=>{const invoices=data.invoices.filter(i=>i.project_id===p.id);return {...p,service:p.brief.service||(p.brief.websiteType==='E-commerce'?'E-commerce':p.brief.websiteType==='Custom'?'Web applications':'Website design & development'),package:p.brief.package,client_name:p.brief.business.contactName,status_label:displayStatus(p),payment_status:paymentState(invoices),balances:totals(invoices)}});
 const emails=[...new Set([...data.clients.map(c=>c.email),...projects.map(p=>p.email)])];
 const clients=emails.map(email=>{const c=data.clients.find(c=>c.email===email)||{email,id:null,name:projects.find(p=>p.email===email)?.client_name,registered:null};const ps=projects.filter(p=>p.email===email);const stage=ps.some(p=>['In progress','Awaiting approval'].includes(p.status_label))?'Active client':ps.length?'Brief submitted':'Registered only';return {...c,company:c.company||ps[0]?.brief.business.name||'',stage,project_count:ps.length,last_activity:[c.registered,c.updated,...ps.map(p=>p.updated),...(data.activity||[]).filter(a=>a.email===email).map(a=>a.created)].filter(Boolean).sort().at(-1)||null,balances:totals(data.invoices.filter(i=>ps.some(p=>p.id===i.project_id)))}});
 const invoices=data.invoices.map(i=>({...i,status_label:invoiceStatus(i),project:projects.find(p=>p.id===i.project_id)}));
 const payments=data.payments.map(p=>({...p,invoice:invoices.find(i=>i.id===p.invoice_id)}));
 return {...data,projects,clients,invoices,payments};
}
export function reportCrm(raw,f={}){
 const historical=f.asOf?{...raw,invoices:raw.invoices.map(i=>({...i,paid:raw.payments.filter(p=>p.invoice_id===i.id&&p.created.slice(0,10)<=f.asOf).reduce((sum,p)=>sum+p.amount,0)})),payments:raw.payments.filter(p=>p.created.slice(0,10)<=f.asOf)}:raw;
 const data=enrichCrm(historical);
 if(f.asOf)data.invoices.forEach(i=>i.status_label=invoiceStatus(i,f.asOf));
 const projectBase=p=>(!f.client||p.email===f.client)&&(!f.project||p.id===f.project)&&(!f.status||p.status_label===f.status)&&(!f.service||p.service===f.service)&&(!f.package||p.package===f.package)&&(!f.payment||p.payment_status===f.payment);
 const projectText=p=>textMatch([p.name,p.reference,p.email,p.client_name],f.search);
 const matchingProject=i=>i?.project&&projectBase(i.project)&&(!f.search||projectText(i.project)||textMatch([i.id,i.description],f.search));
 const invoices=data.invoices.filter(i=>matchingProject(i)&&between(i.created,f)&&(!f.currency||i.currency===f.currency)&&(!f.invoiceStatus||i.status_label===f.invoiceStatus));
 const payments=data.payments.filter(p=>matchingProject(p.invoice)&&between(p.created,f)&&(!f.currency||p.invoice.currency===f.currency)&&(!f.invoiceStatus||p.invoice.status_label===f.invoiceStatus));
 const projects=data.projects.filter(p=>projectBase(p)&&projectText(p)&&between(p.created,f));
 const clients=data.clients.filter(c=>(!f.client||c.email===f.client)&&(!f.stage||c.stage===f.stage||(f.stage==='Has submitted'&&c.project_count>0))&&textMatch([c.name,c.email,c.company||'',c.id||''],f.search)&&(['submitted','active'].includes(f.cohort)?projects.some(p=>p.email===c.email&&(f.cohort!=='active'||['In progress','Awaiting approval'].includes(p.status_label))):((!f.from&&!f.to)||between(c.registered,f)))&& (f.cohort!=='registered'||!!c.registered));
 const monthly={};const bucket=d=>monthly[d.slice(0,7)]??={month:d.slice(0,7),registrations:0,submissions:0,finance:{}};
 clients.filter(c=>c.registered).forEach(c=>bucket(c.registered).registrations++);projects.forEach(p=>bucket(p.created).submissions++);
 invoices.forEach(i=>{const b=bucket(i.created).finance[i.currency]??={invoiced:0,collected:0};b.invoiced+=i.total});payments.forEach(p=>{const b=bucket(p.created).finance[p.invoice.currency]??={invoiced:0,collected:0};b.collected+=p.amount});
 const dates=Object.keys(monthly).sort();if(dates.length||(f.from&&f.to)){let d=new Date((f.from?.slice(0,7)||dates[0])+'-01T00:00:00Z');const end=f.to?.slice(0,7)||dates.at(-1);let count=0;while(d.toISOString().slice(0,7)<=end&&count++<240){bucket(d.toISOString());d.setUTCMonth(d.getUTCMonth()+1)}}
 const baseInvoices=data.invoices.filter(i=>matchingProject(i)&&(!f.currency||i.currency===f.currency)&&(!f.invoiceStatus||i.status_label===f.invoiceStatus));
 // Outstanding is an end-of-month snapshot from issue/payment events, not a sum of unrelated currencies.
 Object.values(monthly).forEach(b=>{const end=b.month+'-31';for(const c of new Set(baseInvoices.map(i=>i.currency))){const issued=baseInvoices.filter(i=>i.currency===c&&i.created.slice(0,10)<=end);const paid=data.payments.filter(p=>issued.some(i=>i.id===p.invoice_id)&&p.created.slice(0,10)<=end).reduce((n,p)=>n+p.amount,0);(b.finance[c]??={invoiced:0,collected:0}).outstanding=issued.reduce((n,i)=>n+i.total,0)-paid;}});
 const summary={registered:clients.filter(c=>c.registered).length,submittedClients:new Set(projects.map(p=>p.email)).size,activeClients:new Set(projects.filter(p=>['In progress','Awaiting approval'].includes(p.status_label)).map(p=>p.email)).size,projects:projects.length,states:projects.reduce((o,p)=>({...o,[p.status_label]:(o[p.status_label]||0)+1}),{}),billing:totals(invoices),collections:Object.values(payments.reduce((o,p)=>{const c=p.invoice.currency;(o[c]??={currency:c,amount:0}).amount+=p.amount;return o},{}))};
 return {summary,monthly:Object.values(monthly).sort((a,b)=>a.month.localeCompare(b.month)),projects,clients,invoices,payments,options:{clients:data.clients.map(c=>({email:c.email,name:c.name})),projects:data.projects.map(p=>({id:p.id,name:p.name})),services:[...new Set(data.projects.map(p=>p.service))],packages:[...new Set(data.projects.map(p=>p.package))],currencies:[...new Set(data.invoices.map(i=>i.currency))]}};
}
export function csvRows(rows){return rows.map(row=>row.map(v=>{let s=String(v??'');if(/^[=+\-@\t\r\n]/.test(s.trimStart())||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}).join(',')).join('\r\n')}
