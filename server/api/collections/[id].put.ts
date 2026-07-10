import { z } from 'zod'
import { db } from '../../db'
import { collections } from '../../db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { requireAdmin } from '~~/server/utils/auth'
import { mapCollectionEntityToCollection } from '~~/server/mappers/collections'
import { updatedResponse } from '~~/server/utils/response'
import { collectionSchema as schema } from '~~/shared/validations/collection'

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

    const message = 'Colección actualizada correctamente'
    const mappedCollection = mapCollectionEntityToCollection(updatedCollection)

    return updatedResponse<Collection>(message, mappedCollection)
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
