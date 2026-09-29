import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
export function openStore(dir) {
  mkdirSync(dir,{recursive:true});
  const db=new DatabaseSync(join(dir,'cws.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS tokens(hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,reference TEXT UNIQUE NOT NULL,email TEXT NOT NULL,name TEXT NOT NULL,brief TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'New',progress INTEGER NOT NULL DEFAULT 0,version INTEGER NOT NULL DEFAULT 1,created TEXT NOT NULL,updated TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,project_id TEXT UNIQUE REFERENCES projects(id),status TEXT NOT NULL DEFAULT 'New');
    CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,project_id TEXT UNIQUE REFERENCES projects(id),status TEXT NOT NULL DEFAULT 'Submitted',package TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS requests(key TEXT PRIMARY KEY,hash TEXT NOT NULL,project_id TEXT REFERENCES projects(id));
    CREATE TABLE IF NOT EXISTS messages(id TEXT PRIMARY KEY,project_id TEXT REFERENCES projects(id),user_id TEXT REFERENCES users(id),body TEXT NOT NULL,created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS uploads(id TEXT PRIMARY KEY,owner_hash TEXT NOT NULL,project_id TEXT REFERENCES projects(id),name TEXT NOT NULL,path TEXT NOT NULL,size INTEGER NOT NULL,mime TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'Quarantined',created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS tickets(id TEXT PRIMARY KEY,email TEXT NOT NULL,project_id TEXT REFERENCES projects(id),subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Open',created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS invoices(id TEXT PRIMARY KEY,project_id TEXT REFERENCES projects(id),description TEXT NOT NULL,currency TEXT NOT NULL,total INTEGER NOT NULL,paid INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'Unpaid',created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS payments(id TEXT PRIMARY KEY,invoice_id TEXT REFERENCES invoices(id),amount INTEGER NOT NULL,reference TEXT UNIQUE NOT NULL,created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS deliverables(id TEXT PRIMARY KEY,project_id TEXT REFERENCES projects(id),title TEXT NOT NULL,url TEXT NOT NULL,version INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'Awaiting review',feedback TEXT NOT NULL DEFAULT '',created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS service_records(id TEXT PRIMARY KEY,project_id TEXT REFERENCES projects(id),type TEXT NOT NULL,label TEXT NOT NULL,status TEXT NOT NULL,renewal TEXT,details TEXT NOT NULL DEFAULT '');
    CREATE TABLE IF NOT EXISTS inquiries(id TEXT PRIMARY KEY,body TEXT NOT NULL,created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,recipient TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,next_try INTEGER NOT NULL DEFAULT 0,state TEXT NOT NULL DEFAULT 'Pending');
    CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,actor TEXT NOT NULL,action TEXT NOT NULL,entity TEXT NOT NULL,details TEXT NOT NULL,created TEXT NOT NULL);
  `);
  if(!db.prepare('PRAGMA table_info(projects)').all().some(c=>c.name==='checks'))db.exec("ALTER TABLE projects ADD COLUMN checks TEXT NOT NULL DEFAULT '[]'");
  return db;
}
