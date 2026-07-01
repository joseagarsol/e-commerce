import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const session = await getAuthSession(event)

    if (!session.data.userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autenticado'
      })
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, session.data.userId))
      .limit(1)

    if (!user) {
      await session.clear()
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuario no encontrado'
      })
    }

    return user
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener el usuario'
    })
  }
})
