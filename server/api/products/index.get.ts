import { db } from '../../db'
import { products } from '../../db/schema'

export default defineEventHandler(async () => {
  try {
    const allProducts = await db.select().from(products)

    return allProducts
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching products'
    })
  }
})
