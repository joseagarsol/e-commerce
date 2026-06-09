import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { collections, products } from '../../db/schema'

export default defineEventHandler(async (event) => {
  try {
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

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Colección no encontrada'
      })
    }

    return {
      success: true,
      message: 'Colección eliminada correctamente',
      deletedCollection: result[0]
    }
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
