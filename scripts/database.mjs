import {openStore} from '../server/store.js';
const db=openStore(process.env.DATA_DIR||'data');
try{console.log('Database initialized. Schema version: '+db.prepare('SELECT MAX(version) AS v FROM schema_migrations').get().v);console.log('Integrity: '+db.prepare('PRAGMA integrity_check').get().integrity_check)}finally{db.close()}
