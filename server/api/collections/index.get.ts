import { db } from '../../db'
import { collections } from '../../db/schema'
import { mapCollectionEntityToCollection } from '~~/server/mappers/collections'

export default defineEventHandler(async () => {
  try {
    const allCollections = await db.select().from(collections)
    return allCollections.map(collectionEntity => mapCollectionEntityToCollection(collectionEntity))
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching collections'
    })
  }
})
