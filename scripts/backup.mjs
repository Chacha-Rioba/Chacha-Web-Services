import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
const dir=resolve(process.env.DATA_DIR||'data');
const targetDir=join(dir,'backups');mkdirSync(targetDir,{recursive:true});
const db=new DatabaseSync(join(dir,'cws.sqlite'),{readOnly:true});
const target=join(targetDir,'cws-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite');
try{await backup(db,target);const check=new DatabaseSync(target,{readOnly:true});try{const result=check.prepare('PRAGMA integrity_check').get();if(Object.values(result)[0]!=='ok')throw new Error('Backup integrity check failed.');}finally{check.close()}console.log('Verified database backup: '+target);}finally{db.close()}
