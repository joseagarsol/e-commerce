import { z } from 'zod'
import { db } from '../../db'
import { products } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~~/server/utils/auth'

const schema = z.object({
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

    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID del producto no proporcionado'
      })
    }

    const body = await readBody(event)
    const validatedData = schema.parse(body)

    const [updatedProduct] = await db
      .update(products)
      .set({
        name: validatedData.name,
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

    return {
      success: true,
      message: 'Producto actualizado correctamente',
      updatedProduct: updatedProduct
    }
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
