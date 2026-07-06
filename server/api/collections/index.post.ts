import { z } from 'zod'
import { collections } from '../../db/schema'
import { db } from '../../db'
import { requireAdmin } from '~~/server/utils/auth'

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  imageUrl: z.string().min(1, 'La imagen de la colección debe tener al menos 1 caracter')
})

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const body = await readBody(event)
    const validatedData = schema.parse(body)

    const collectionId = validatedData.id || validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const [newCollection] = await db.insert(collections).values({
      ...validatedData,
      id: collectionId
    }).returning()

    setResponseStatus(event, 201)
    return newCollection
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
