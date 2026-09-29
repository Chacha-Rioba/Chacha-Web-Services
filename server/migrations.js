export function migrateWorkspace(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);`);
  if (!db.prepare('SELECT 1 FROM schema_migrations WHERE version=1').get()) {
  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS profiles(user_id TEXT PRIMARY KEY REFERENCES users(id),company TEXT NOT NULL DEFAULT '',phone TEXT NOT NULL DEFAULT '',updated TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS project_meta(project_id TEXT PRIMARY KEY REFERENCES projects(id),priority TEXT NOT NULL DEFAULT 'Normal' CHECK(priority IN ('Low','Normal','High','Urgent')),due_date TEXT NOT NULL DEFAULT '',owner TEXT NOT NULL DEFAULT '',version INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS project_tasks(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),title TEXT NOT NULL,assignee TEXT NOT NULL CHECK(assignee IN ('Team','Client')),status TEXT NOT NULL DEFAULT 'Open' CHECK(status IN ('Open','In progress','Done')),due_date TEXT NOT NULL DEFAULT '',version INTEGER NOT NULL DEFAULT 1,created TEXT NOT NULL,updated TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS staff_notes(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),user_id TEXT NOT NULL REFERENCES users(id),body TEXT NOT NULL,created TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS ticket_replies(id TEXT PRIMARY KEY,ticket_id TEXT NOT NULL REFERENCES tickets(id),user_id TEXT NOT NULL REFERENCES users(id),body TEXT NOT NULL,created TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS projects_email_created ON projects(email,created);
      CREATE INDEX IF NOT EXISTS messages_project_created ON messages(project_id,created);
      CREATE INDEX IF NOT EXISTS invoices_project ON invoices(project_id);
      CREATE INDEX IF NOT EXISTS uploads_project ON uploads(project_id);
      CREATE INDEX IF NOT EXISTS deliverables_project_version ON deliverables(project_id,version);
      CREATE INDEX IF NOT EXISTS tickets_email ON tickets(email);
      CREATE INDEX IF NOT EXISTS tasks_project ON project_tasks(project_id);
      CREATE INDEX IF NOT EXISTS notes_project ON staff_notes(project_id);
      CREATE INDEX IF NOT EXISTS replies_ticket ON ticket_replies(ticket_id);
      CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS audit_entity ON audit(entity,id);
    `);
    db.prepare('INSERT INTO schema_migrations VALUES(1,?)').run(new Date().toISOString());
    db.exec('COMMIT');
  } catch(error) { db.exec('ROLLBACK'); throw error; }
  }
  if (!db.prepare('SELECT 1 FROM schema_migrations WHERE version=2').get()) {
    db.exec('BEGIN IMMEDIATE');
    try {
      db.exec("ALTER TABLE invoices ADD COLUMN due_date TEXT NOT NULL DEFAULT ''; ALTER TABLE invoices ADD COLUMN version INTEGER NOT NULL DEFAULT 1; CREATE INDEX IF NOT EXISTS payments_created ON payments(created); CREATE INDEX IF NOT EXISTS invoices_created ON invoices(created);");
      db.prepare('INSERT INTO schema_migrations VALUES(2,?)').run(new Date().toISOString());
      db.exec('COMMIT');
    } catch(error) { db.exec('ROLLBACK'); throw error; }
  }
}
