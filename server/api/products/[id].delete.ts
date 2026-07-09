import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { products } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapProductEntityToProduct } from '~~/server/mappers/product'
import { deletedResponse } from '~~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)

    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID del producto no proporcionado'
      })
    }

    const [deletedProduct] = await db.delete(products)
      .where(eq(products.id, idParam))
      .returning()

    if (!deletedProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    const message = 'Producto eliminado correctamente'
    const mappedProduct = mapProductEntityToProduct(deletedProduct)

    return deletedResponse<Product>(message, mappedProduct)
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
