import Database from "better-sqlite3";

const db = new Database("database.sqlite");

db.exec(`
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  filename TEXT,
  parsed_json TEXT,
  created_at TEXT
);
`);

export default db;
