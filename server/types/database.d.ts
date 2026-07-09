import type { collections } from '../db/schema'

export type CollectionEntity = typeof collections.$inferSelect
