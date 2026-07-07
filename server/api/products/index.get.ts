import { db } from '../../db'
import { products, collections } from '../../db/schema'
import { eq, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const collectionId = query.collection as string | undefined

    let allProducts: (typeof products.$inferSelect)[] = []

    if (collectionId) {
      const [collection] = await db.select({ id: collections.id })
        .from(collections)
        .where(
          or(
            eq(collections.id, collectionId),
            eq(collections.slug, collectionId)
          )
        )
        .limit(1)

      if (collection) {
        allProducts = await db.select()
          .from(products)
          .where(eq(products.collectionId, collection.id))
      }
    } else {
      allProducts = await db.select().from(products)
    }

    return allProducts
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching products'
    })
  }
})
