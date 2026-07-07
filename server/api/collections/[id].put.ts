import { z } from 'zod'
import { db } from '../../db'
import { collections } from '../../db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { requireAdmin } from '~~/server/utils/auth'

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(1, 'El slug debe tener al menos 1 caracter'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  imageUrl: z.string().min(1, 'La imagen de la colección debe tener al menos 1 caracter')
})

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

    const body = await readBody(event)
    const validatedData = schema.parse(body)

    const existingSlug = await db.select()
      .from(collections)
      .where(
        and(
          eq(collections.slug, validatedData.slug),
          ne(collections.id, idParam)
        )
      )
      .get()

    if (existingSlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El slug ya está en uso por otra colección'
      })
    }

    const [updatedCollection] = await db
      .update(collections)
      .set({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl
      })
      .where(eq(collections.id, idParam))
      .returning()

    if (!updatedCollection) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Colección no encontrada'
      })
    }

    return {
      success: true,
      message: 'Colección actualizada correctamente',
      updatedCollection: updatedCollection
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de colección inválidos',
        data: flattened.fieldErrors
      })
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar la colección en la base de datos'
    })
  }
})
