import { z } from 'zod'
import { collections } from '../../db/schema'
import { db } from '../../db'
import { requireAdmin } from '~~/server/utils/auth'
import { or, eq } from 'drizzle-orm'
import { mapCollectionEntityToCollection } from '~~/server/mappers/collections'
import { createdResponse } from '~~/server/utils/response'
import { collectionSchema as schema } from '~~/shared/validations/collection'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const body = await readBody(event)
    const validatedData = schema.parse(body)

    const collectionId = validatedData.id || validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const existing = await db.select()
      .from(collections)
      .where(
        or(
          eq(collections.id, collectionId),
          eq(collections.slug, validatedData.slug)
        )
      )
      .get()

    if (existing) {
      if (existing.id === collectionId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Ya existe una colección con este ID o Nombre'
        })
      }
      if (existing.slug === validatedData.slug) {
        throw createError({
          statusCode: 400,
          statusMessage: 'El slug ya está en uso por otra colección'
        })
      }
    }

    const [newCollection] = await db.insert(collections).values({
      ...validatedData,
      id: collectionId
    }).returning()

    if (!newCollection) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear la colección en la base de datos'
      })
    }

    setResponseStatus(event, 201)
    const message = 'Colección creada correctamente'
    const mappedCollection = mapCollectionEntityToCollection(newCollection)

    return createdResponse<Collection>(message, mappedCollection)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de colección inválidos',
        data: flattened.fieldErrors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al guardar la colección en la base de datos'
    })
  }
})
