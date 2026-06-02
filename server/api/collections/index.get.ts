import { db } from '../../db'
import { collections } from '../../db/schema'

export default defineEventHandler(async () => {
  try {
    const allCollections = await db.select().from(collections)
    return allCollections
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching collections'
    })
  }
})
