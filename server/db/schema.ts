import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().notNull(),
  stock: integer('stock').notNull().default(0),
  availableSizes: text('available_sizes', { mode: 'json' }).$type<string[] | null>(),
  stockBySize: text('stock_by_size', { mode: 'json' }).$type<Record<string, number> | null>()
})
