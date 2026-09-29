export const INBOX='project@cws.com';
export const FORM_ENDPOINT='https://formsubmit.co/ajax/'+INBOX;
export const requestKinds=['Project inquiry','General inquiry','Meeting request'];
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function prepareInquiry(values,kind){
 if(!requestKinds.includes(kind))throw Error('Choose a valid request type.');
 const clean=k=>String(values[k]||'').trim();
 if(clean('_honey'))throw Error('Please leave the website verification field empty.');
 if(clean('name').length<2||clean('name').length>100)throw Error('Please enter your name (2–100 characters).');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean('email'))||clean('email').length>254)throw Error('Please enter a valid email address.');
 if(clean('message').length<20||clean('message').length>4000)throw Error('Please describe your request in 20–4,000 characters.');
 if(values.privacy!=='on')throw Error('Please confirm you have read the privacy notice.');
 const fields={name:clean('name'),email:clean('email'),company:clean('company'),phone:clean('phone'),service:clean('service'),package:clean('package'),message:clean('message')};
 for(const k of ['company','phone','service','package'])if(fields[k].length>150)throw Error('One of the fields is too long. Please shorten it.');
 if(kind==='Meeting request'){
  const date=clean('preferred_date'),time=clean('preferred_time'),zone=clean('time_zone');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<localDate())throw Error('Choose today or a future date for your meeting request.');
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw Error('Choose a preferred meeting time.');
  try{new Intl.DateTimeFormat('en',{timeZone:zone}).format()}catch{throw Error('Please enter a valid time zone, such as Africa/Nairobi.');}
  if(!zone)throw Error('Please provide your time zone.');
  Object.assign(fields,{preferred_date:date,preferred_time:time,time_zone:zone,alternative_times:clean('alternative_times').slice(0,500),booking_status:'Request only — awaiting confirmation from CWS'});
 }
 return {...fields,request_type:kind,privacy_acknowledgement:'Read and accepted',_subject:'CWS | '+kind,_template:'table',_honey:''};
}
export async function sendInquiry(values,kind,fetcher=fetch){
 const body=prepareInquiry(values,kind);
 try{
  const response=await fetcher(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
  const data=await response.json();
  if(/activat|confirm.*email|verif.*email/i.test(String(data.message||'')))throw Error('Email delivery is awaiting inbox activation. Please email '+INBOX+' directly for now.');
  if(!response.ok||![true,'true'].includes(data.success))throw Error('The email service did not accept this request. Please try again or email '+INBOX+'.');
  return {accepted:true};
 }catch(error){if(error.message?.includes(INBOX))throw error;throw Error('We could not confirm your submission. Your details are still here. Please try again or email '+INBOX+' directly.');}
}
