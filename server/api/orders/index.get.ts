import { db } from '../../db'
import { orders, users } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // 1. Validar autenticación
    const session = await getAuthSession(event)
    if (!session.data.userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autorizado'
      })
    }

    // 2. Obtener rol del usuario
    const [user] = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.data.userId))
      .limit(1)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuario no encontrado'
      })
    }

    // 3. Recuperar pedidos según rol
    let results
    if (user.role === 'admin') {
      results = await db.select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
    } else {
      results = await db.select()
        .from(orders)
        .where(eq(orders.userId, session.data.userId))
        .orderBy(desc(orders.createdAt))
    }

    return results
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los pedidos'
    })
  }
})
