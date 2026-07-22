import { getRawDatabase } from '../db'

export class SettingsRepository {
  static set(key: string, value: string | Record<string, unknown>) {
    const db = getRawDatabase()
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)

    db.prepare(
      `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ).run(key, stringValue)

    return { key, value: stringValue }
  }

  static get(key: string) {
    const db = getRawDatabase()
    const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
      { value: string } | undefined

    if (!result) return null

    try {
      return JSON.parse(result.value)
    } catch {
      return result.value
    }
  }

  static getAll() {
    const db = getRawDatabase()
    const allSettings = db.prepare('SELECT key, value FROM settings').all() as {
      key: string
      value: string
    }[]

    return allSettings.reduce(
      (acc: Record<string, unknown>, setting: { key: string; value: string }) => {
        try {
          acc[setting.key] = JSON.parse(setting.value)
        } catch {
          acc[setting.key] = setting.value
        }
        return acc
      },
      {} as Record<string, unknown>,
    )
  }

  static delete(key: string) {
    const db = getRawDatabase()
    db.prepare('DELETE FROM settings WHERE key = ?').run(key)
    return { success: true }
  }

  static clear() {
    const db = getRawDatabase()
    db.prepare('DELETE FROM settings').run()
    return { success: true }
  }
}
