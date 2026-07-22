import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

// Categories Table
export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    color: text('color').notNull(), // Hex color
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    nameIdx: index('categories_name_idx').on(table.name),
  }),
)

// Tasks Table
export const tasks = sqliteTable(
  'tasks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description'),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    priority: text('priority', { enum: ['HIGH', 'MEDIUM', 'LOW'] })
      .notNull()
      .default('MEDIUM'),
    status: text('status', { enum: ['PENDING', 'COMPLETED'] })
      .notNull()
      .default('PENDING'),
    dueDate: integer('due_date'), // Unix timestamp
    recurringType: text('recurring_type', {
      enum: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
    }).default('NONE'),
    recurringInterval: integer('recurring_interval'), // For custom recurring
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
    completedAt: integer('completed_at'), // Unix timestamp
  },
  (table) => ({
    categoryIdIdx: index('tasks_category_id_idx').on(table.categoryId),
    statusIdx: index('tasks_status_idx').on(table.status),
    dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
    completedAtIdx: index('tasks_completed_at_idx').on(table.completedAt),
  }),
)

// Reminders Table
export const reminders = sqliteTable(
  'reminders',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    taskId: integer('task_id')
      .notNull()
      .unique()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    reminderTime: integer('reminder_time').notNull(), // Unix timestamp
    repeatType: text('repeat_type', {
      enum: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
    })
      .notNull()
      .default('NONE'),
    customInterval: integer('custom_interval'), // For custom repeat intervals
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  },
  (table) => ({
    taskIdIdx: index('reminders_task_id_idx').on(table.taskId),
    reminderTimeIdx: index('reminders_reminder_time_idx').on(table.reminderTime),
  }),
)

// Settings Table
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(), // JSON or string
})

// Migrations Table (for tracking applied migrations)
export const migrations = sqliteTable('migrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  appliedAt: integer('applied_at').notNull(),
})
