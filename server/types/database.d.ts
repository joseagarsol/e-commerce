import type { collections, discountCodes, orders, orderItems } from '../db/schema'

export type CollectionEntity = typeof collections.$inferSelect
export type DiscountCodeEntity = typeof discountCodes.$inferSelect
export type OrderEntity = typeof orders.$inferSelect
export type OrderItemsEntity = typeof orderItems.$inferSelect
