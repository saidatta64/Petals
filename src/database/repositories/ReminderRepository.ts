import { getDatabase } from '../db'
import * as schema from '../schema'
import { eq } from 'drizzle-orm'

export interface CreateReminderInput {
  taskId: number
  reminderTime: number
  repeatType: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  customInterval?: number
  enabled?: boolean
}

export class ReminderRepository {
  static create(input: CreateReminderInput) {
    return getDatabase()
      .insert(schema.reminders)
      .values({
        taskId: input.taskId,
        reminderTime: input.reminderTime,
        repeatType: input.repeatType,
        customInterval: input.customInterval,
        enabled: input.enabled ?? true,
      })
      .returning()
      .get()
  }

  static getById(id: number) {
    return getDatabase().query.reminders.findFirst({
      where: eq(schema.reminders.id, id),
    }).sync()
  }

  static getByTaskId(taskId: number) {
    return getDatabase().query.reminders.findFirst({
      where: eq(schema.reminders.taskId, taskId),
    }).sync()
  }

  static getAll() {
    return getDatabase().query.reminders.findMany().sync()
  }

  static getEnabled() {
    return getDatabase().query.reminders.findMany({
      where: eq(schema.reminders.enabled, true),
    }).sync()
  }

  static update(id: number, input: Partial<CreateReminderInput>) {
    return getDatabase()
      .update(schema.reminders)
      .set(input)
      .where(eq(schema.reminders.id, id))
      .returning()
      .get()
  }

  static delete(id: number) {
    return getDatabase().delete(schema.reminders).where(eq(schema.reminders.id, id)).run()
  }

  static deleteByTaskId(taskId: number) {
    return getDatabase().delete(schema.reminders).where(eq(schema.reminders.taskId, taskId)).run()
  }
}
