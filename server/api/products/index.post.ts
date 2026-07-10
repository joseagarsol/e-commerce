import { z } from 'zod'
import { db } from '../../db'
import { products } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapProductEntityToProduct } from '~~/server/mappers/product'
import { createdResponse } from '~~/server/utils/response'
import { createProductSchema } from '~~/shared/validations/product'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)

    const body = await readBody(event)
    const productSchema = createProductSchema(!!body?.stockBySize)
    const validatedData = productSchema.parse(body)

    const productId = validatedData.id || validatedData.slug

    const [newProduct] = await db.insert(products).values({
      ...validatedData,
      id: productId
    }).returning()

    if (!newProduct) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear el producto'
      })
    }

    setResponseStatus(event, 201)
    const message = 'Producto creado correctamente'
    const mappedProduct = mapProductEntityToProduct(newProduct)

    return createdResponse<Product>(message, mappedProduct)
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
      statusMessage: 'Error al guardar el producto en la base de datos'
    })
  }
})
