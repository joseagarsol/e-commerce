import { collections } from '~~/server/db/schema'
import { eq, or } from 'drizzle-orm'
import { db } from '~~/server/db'
import { mapCollectionEntityToCollection } from '~~/server/mappers/collections'

export default defineEventHandler(async (event) => {
  try {
    const idOrSlug = getRouterParam(event, 'id')

    if (!idOrSlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Identificador o slug de la colección no proporcionado'
      })
    }

    const collection = await db
      .select()
      .from(collections)
      .where(
        or(
          eq(collections.id, idOrSlug),
          eq(collections.slug, idOrSlug)
        )
      )
      .get()

    if (!collection) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Colección no encontrada'
      })
    }

    return mapCollectionEntityToCollection(collection)
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener la colección de la base de datos'
    })
  }
})
