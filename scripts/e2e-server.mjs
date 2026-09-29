// One process owns both servers. Each run gets an isolated database and ephemeral API port.
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
import {createApp} from '../server/app.js';
import {mkdtempSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
process.env.SMTP_HOST='';process.env.MAIL_FROM='';process.env.STAFF_EMAIL='';
const origin='http://localhost:5174';
const {app,db}=createApp({dataDir:mkdtempSync(join(tmpdir(),'cws-browser-')),origin,admins:'project@cws.com',devLinks:true});
const api=app.listen(0,'127.0.0.1');await new Promise(r=>api.once('listening',r));
const vite=await createServer({configFile:false,plugins:[react()],server:{port:5174,host:'127.0.0.1',strictPort:true,proxy:{'/api':'http://127.0.0.1:'+api.address().port}}});await vite.listen();
async function close(){await vite.close();api.close(()=>{db.close();process.exit(0)})}process.on('SIGTERM',close);process.on('SIGINT',close);
