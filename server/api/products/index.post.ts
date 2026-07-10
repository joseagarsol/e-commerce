import { z } from 'zod'
import { db } from '../../db'
import { products } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapProductEntityToProduct } from '~~/server/mappers/product'
import { createdResponse } from '~~/server/utils/response'

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(1, 'El slug no puede estar vacío'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  price: z.number().positive('El precio debe ser mayor que 0'),
  images: z.array(z.string().min(1, 'La ruta de la imagen no puede estar vacía')).min(1, 'Debe incluir al menos una imagen'),
  stock: z.number().int().nonnegative().default(0),
  collectionId: z.string().min(1, 'La colección del producto debe ser especificada'),
  availableSizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL'])).nullable().optional(),
  stockBySize: z.record(z.string(), z.number().int().nonnegative()).nullable().optional()
})

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)

    const body = await readBody(event)
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
