import { getDatabase } from '../db'
import * as schema from '../schema'
import { eq, and, or, gte, lte, like } from 'drizzle-orm'

export interface CreateTaskInput {
  title: string
  description?: string
  categoryId: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate?: number
  recurringType?: string
  recurringInterval?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  categoryId?: number
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate?: number
  status?: 'PENDING' | 'COMPLETED'
  completedAt?: number
}

export class TaskRepository {
  static create(input: CreateTaskInput) {
    const now = Date.now()

    return getDatabase()
      .insert(schema.tasks)
      .values({
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        priority: input.priority,
        dueDate: input.dueDate,
        recurringType: (input.recurringType ||
          'NONE') as (typeof schema.tasks.recurringType.enumValues)[number],
        recurringInterval: input.recurringInterval,
        createdAt: now,
        updatedAt: now,
        status: 'PENDING',
      })
      .returning()
      .get()
  }

  static getById(id: number) {
    return getDatabase()
      .query.tasks.findFirst({
        where: eq(schema.tasks.id, id),
      })
      .sync()
  }

  static getAll() {
    return getDatabase().query.tasks.findMany().sync()
  }

  static getByStatus(status: 'PENDING' | 'COMPLETED') {
    return getDatabase()
      .query.tasks.findMany({
        where: eq(schema.tasks.status, status),
      })
      .sync()
  }

  static getByCategoryId(categoryId: number) {
    return getDatabase()
      .query.tasks.findMany({
        where: eq(schema.tasks.categoryId, categoryId),
      })
      .sync()
  }

  static getToday() {
    const now = Date.now()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    return getDatabase()
      .query.tasks.findMany({
        where: and(
          eq(schema.tasks.status, 'PENDING'),
          or(
            and(
              gte(schema.tasks.dueDate, startOfDay.getTime()),
              lte(schema.tasks.dueDate, endOfDay.getTime()),
            ),
            and(
              gte(schema.tasks.createdAt, startOfDay.getTime()),
              lte(schema.tasks.createdAt, endOfDay.getTime()),
            ),
          ),
        ),
      })
      .sync()
  }

  static update(id: number, input: UpdateTaskInput) {
    const now = Date.now()

    return getDatabase()
      .update(schema.tasks)
      .set({
        ...input,
        updatedAt: now,
      })
      .where(eq(schema.tasks.id, id))
      .returning()
      .get()
  }

  static complete(id: number) {
    const now = Date.now()

    return getDatabase()
      .update(schema.tasks)
      .set({
        status: 'COMPLETED',
        completedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.tasks.id, id))
      .returning()
      .get()
  }

  static delete(id: number) {
    getDatabase().delete(schema.reminders).where(eq(schema.reminders.taskId, id)).run()
    return getDatabase().delete(schema.tasks).where(eq(schema.tasks.id, id)).run()
  }

  static getCompletedCount(startDate: number, endDate: number) {
    return getDatabase()
      .select()
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.status, 'COMPLETED'),
          gte(schema.tasks.completedAt, startDate),
          lte(schema.tasks.completedAt, endDate),
        ),
      )
      .all().length
  }

  static getCompletedByDate(date: Date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return getDatabase()
      .query.tasks.findMany({
        where: and(
          eq(schema.tasks.status, 'COMPLETED'),
          gte(schema.tasks.completedAt, startOfDay.getTime()),
          lte(schema.tasks.completedAt, endOfDay.getTime()),
        ),
      })
      .sync()
  }

  static search(query: string) {
    return getDatabase()
      .query.tasks.findMany({
        where: and(
          eq(schema.tasks.status, 'PENDING'),
          like(schema.tasks.title, `%${query.toLowerCase()}%`),
        ),
      })
      .sync()
  }
}
