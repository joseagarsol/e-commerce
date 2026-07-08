import { z } from 'zod'
import { db } from '../../db'
import { products } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
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

    const productId = validatedData.id || validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const productSlug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const [newProduct] = await db.insert(products).values({
      ...validatedData,
      id: productId,
      slug: productSlug
    }).returning()

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
