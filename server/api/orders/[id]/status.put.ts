import { z } from 'zod'
import { db } from '~~/server/db'
import { users, orders } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'cancelled'])
})

export default defineEventHandler(async (event) => {
  try {
    const session = await getAuthSession(event)
    if (!session.data.userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autorizado'
      })
    }

    const [user] = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.data.userId))
      .limit(1)

    if (!user || user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Acceso denegado. Se requieren permisos de administrador.'
      })
    }

    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de pedido requerido'
      })
    }

    const body = await readBody(event)
    const { status } = schema.parse(body)

    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))

    if (result.rowsAffected === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pedido no encontrado'
      })
    }

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Estado del pedido inválido',
        data: flattened.fieldErrors
      })
    }

    if (error instanceof Error) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar el estado del pedido'
    })
  }
})
