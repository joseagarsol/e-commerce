import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { products } from '../../db/schema'

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID del producto no proporcionado'
      })
    }

    const productId = parseInt(idParam, 10)

    if (isNaN(productId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El ID del producto debe ser un número válido'
      })
    }

    const result = await db.delete(products)
      .where(eq(products.id, productId))
      .returning()

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    return {
      success: true,
      message: 'Producto eliminado correctamente',
      deletedProduct: result[0]
    }
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
