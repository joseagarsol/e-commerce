import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const email = query.email as string

    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'El parámetro email es requerido y debe ser válido.'
      })
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      return {
        isFound: false
      }
    }
    return {
      isFound: true,
      user: user
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al verificar email'
    })
  }
})
