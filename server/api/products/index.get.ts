import { db } from '../../db'
import { products, collections } from '../../db/schema'
import { eq, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const collectionId = query.collection as string | undefined

    interface ProductWithCollection {
      id: string
      name: string
      slug: string
      description: string
      price: number
      images: string[]
      stock: number
      availableSizes: string[] | null
      stockBySize: Record<string, number> | null
      collectionId: string | null
      collectionSlug: string | null
      collectionName: string | null
    }

    let allProducts: ProductWithCollection[] = []

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
        allProducts = await db.select({
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
          .where(eq(products.collectionId, collection.id))
      }
    } else {
      allProducts = await db.select({
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
    }

    return allProducts
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching products'
    })
  }
})
