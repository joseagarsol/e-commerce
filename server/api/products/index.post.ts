import { z } from 'zod'
import { db } from '../../db'
import { products } from '../../db/schema'

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  price: z.number().positive('El precio debe de ser mayor que 0'),
  imageUrl: z.url('Debe de ser una URL válida')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const validatedData = productSchema.parse(body)

    const [newProduct] = await db.insert(products).values(validatedData).returning()

    setResponseStatus(event, 201)
    return newProduct
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de producto inválidos',
        data: flattened.fieldErrors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al guardar el producto en la base de datos'
    })
  }
})
