import type { collections, discountCodes } from '../db/schema'

export type CollectionEntity = typeof collections.$inferSelect
export type DiscountCodeEntity = typeof discountCodes.$inferSelect
