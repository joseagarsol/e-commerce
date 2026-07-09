import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { collections, products } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapCollectionEntityToCollection } from '~~/server/mappers/collections'
import { deletedResponse } from '~~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de la colección no proporcionado'
      })
    }

    const result = await db.delete(collections)
      .where(eq(collections.id, idParam))
      .returning()

    const associatedProducts = await db.select()
      .from(products)
      .where(eq(products.collectionId, idParam))
      .limit(1)

    if (associatedProducts.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se puede eliminar la colección porque tiene prendas asociadas. Mueve las prendas a otra colección primero.'
      })
    }

    const deletedCollection = result[0]
    if (!deletedCollection) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Colección no encontrada'
      })
    }

    const message = 'Colección eliminada correctamente'
    const mappedCollection = mapCollectionEntityToCollection(deletedCollection)

    return deletedResponse<Collection>(message, mappedCollection)
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar la colección de la base de datos'
    })
  }
})
