import { createApp } from './app.js';
const {app,db,flushMail}=createApp();
const server=app.listen(Number(process.env.PORT||3001),()=>console.log('CWS server ready'));
const timer=setInterval(flushMail,15000);
function close(){clearInterval(timer);server.close(()=>{db.close();process.exit(0);});}
process.on('SIGTERM',close);process.on('SIGINT',close);
