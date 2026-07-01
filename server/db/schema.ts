import { sql } from 'drizzle-orm'
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'

export const discountCodes = sqliteTable('discount_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type', { enum: ['percent', 'price'] }).notNull(),
  apply: text('apply', { enum: ['shipping', 'cartPrice'] }).notNull(),
  discount: real('discount').notNull()
})

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url')
})

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().notNull(),
  stock: integer('stock').notNull().default(0),
  availableSizes: text('available_sizes', { mode: 'json' }).$type<string[] | null>(),
  stockBySize: text('stock_by_size', { mode: 'json' }).$type<Record<string, number> | null>(),
  collectionId: text('collection_id').references(() => collections.id)
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'customer'] })
    .notNull().default('customer'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  address: text('address').notNull(),
  postalCode: text('postal_code').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  shippingMethod: text('shipping_method').notNull(),
  shippingPrice: real('shipping_price').notNull(),
  paymentMethod: text('payment_method').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'shipped', 'cancelled'] }).notNull().default('paid'),
  total: real('total').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  size: text('size'),
  price: real('price').notNull()
})
