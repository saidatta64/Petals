import Database from 'better-sqlite3'
import type { Database as SqliteDatabase } from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import * as schema from './schema'

let db: BetterSQLite3Database<typeof schema> | null = null
let rawSqlite: SqliteDatabase | null = null

export function initializeDatabase(customDir?: string) {
  if (db) return db

  let dbPath: string
  if (customDir) {
    dbPath = path.join(customDir, "taskflow.db")
  } else {
    let userDataPath = app.getPath("userData")
    const baseName = path.basename(userDataPath)
    if (baseName !== 'TaskFlow') {
      userDataPath = path.join(path.dirname(userDataPath), 'TaskFlow')
    }
    dbPath = path.join(userDataPath, "taskflow.db")
  }

  // Automatically create directory if it doesn't exist
  const targetFolder = path.dirname(dbPath)
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true })
  }

  const sqlite = new Database(dbPath)
  rawSqlite = sqlite
  sqlite.pragma("journal_mode = WAL")
  sqlite.pragma("foreign_keys = ON")

  db = drizzle(sqlite, { schema: schema })

  // Create tables if they don't exist
  createTables(sqlite)

  return db
}

function createTables(sqlite: SqliteDatabase) {

  // Create categories table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `)

  // Create tasks table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category_id INTEGER NOT NULL,
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      status TEXT NOT NULL DEFAULT 'PENDING',
      due_date INTEGER,
      recurring_type TEXT DEFAULT 'NONE',
      recurring_interval INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      completed_at INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `)

  // Create reminders table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL UNIQUE,
      reminder_time INTEGER NOT NULL,
      repeat_type TEXT NOT NULL DEFAULT 'NONE',
      custom_interval INTEGER,
      enabled INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `)

  // Create settings table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  // Create migrations table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    )
  `)

  // Create indexes
  sqlite.exec(`CREATE INDEX IF NOT EXISTS categories_name_idx ON categories(name)`)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS tasks_category_id_idx ON tasks(category_id)`)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status)`)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date)`)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS tasks_completed_at_idx ON tasks(completed_at)`)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS reminders_task_id_idx ON reminders(task_id)`)
  sqlite.exec(`CREATE INDEX IF NOT EXISTS reminders_reminder_time_idx ON reminders(reminder_time)`)

  // Seed default categories if they don't exist
  seedDefaultCategories(sqlite)
}

function seedDefaultCategories(sqlite: SqliteDatabase) {

  const defaultCategories = [
    { name: 'Study', color: '#3B82F6' },
    { name: 'Development', color: '#22C55E' },
    { name: 'Production', color: '#F97316' },
    { name: 'Personal', color: '#8B5CF6' },
  ]

  const now = Date.now()

  for (const category of defaultCategories) {
    sqlite.prepare(
      `INSERT OR IGNORE INTO categories (name, color, created_at) VALUES (?, ?, ?)`,
    ).run(category.name, category.color, now)
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export function getRawDatabase(): SqliteDatabase {
  if (!rawSqlite) {
    throw new Error('Database not initialized')
  }
  return rawSqlite
}
