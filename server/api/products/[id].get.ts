import { eq, or } from 'drizzle-orm'
import { db } from '../../db'
import { products, collections } from '../../db/schema'

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID o slug del producto no proporcionado'
      })
    }

    const product = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      stock: products.stock,
      availableSizes: products.availableSizes,
      stockBySize: products.stockBySize,
      collectionId: products.collectionId,
      collectionSlug: collections.slug,
      collectionName: collections.name
    })
      .from(products)
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(or(
        eq(products.id, idParam),
        eq(products.slug, idParam)
      ))
      .limit(1)

    return product[0]
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar el producto de la base de datos'
    })
  }
})
