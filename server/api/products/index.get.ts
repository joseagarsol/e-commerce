import { db } from '../../db'
import { products } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const collectionId = query.collection as string | undefined

    let allProducts

    if (collectionId) {
      allProducts = await db.select()
        .from(products)
        .where(eq(products.collectionId, collectionId))
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
