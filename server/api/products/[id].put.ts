import { z } from 'zod'
import { db } from '../../db'
import { products } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~~/server/utils/auth'
import { mapProductEntityToProduct } from '~~/server/mappers/product'
import { updatedResponse } from '~~/server/utils/response'
import { createProductSchema } from '~~/shared/validations/product'

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

    const body = await readBody(event)
    const schema = createProductSchema(!!body?.stockBySize)
    const validatedData = schema.parse(body)

    const [updatedProduct] = await db
      .update(products)
      .set({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        price: validatedData.price,
        images: validatedData.images,
        stock: validatedData.stock,
        availableSizes: validatedData.availableSizes,
        stockBySize: validatedData.stockBySize,
        collectionId: validatedData.collectionId
      })
      .where(eq(products.id, idParam))
      .returning()

    if (!updatedProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
      })
    }

    const message = 'Producto actualizado correctamente'
    const mappedProduct = mapProductEntityToProduct(updatedProduct)

    return updatedResponse<Product>(message, mappedProduct)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de producto inválidos',
        data: flattened.fieldErrors
      })
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar el producto en la base de datos'
    })
  }
})
