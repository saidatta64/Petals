import { getDatabase } from '../db'
import * as schema from '../schema'
import { eq } from 'drizzle-orm'

export interface CreateCategoryInput {
  name: string
  color: string
}

export class CategoryRepository {
  static create(input: CreateCategoryInput) {
    const now = Date.now()

    return getDatabase()
      .insert(schema.categories)
      .values({
        name: input.name,
        color: input.color,
        createdAt: now,
      })
      .returning()
      .get()
  }

  static getById(id: number) {
    return getDatabase()
      .query.categories.findFirst({
        where: eq(schema.categories.id, id),
      })
      .sync()
  }

  static getByName(name: string) {
    return getDatabase()
      .query.categories.findFirst({
        where: eq(schema.categories.name, name),
      })
      .sync()
  }

  static getAll() {
    return getDatabase().query.categories.findMany().sync()
  }

  static update(id: number, input: Partial<CreateCategoryInput>) {
    return getDatabase()
      .update(schema.categories)
      .set(input)
      .where(eq(schema.categories.id, id))
      .returning()
      .get()
  }

  static delete(id: number) {
    const db = getDatabase()
    // Delete all tasks associated with this category to prevent foreign key errors
    db.delete(schema.tasks).where(eq(schema.tasks.categoryId, id)).run()
    // Delete the category
    return db.delete(schema.categories).where(eq(schema.categories.id, id)).run()
  }
}
