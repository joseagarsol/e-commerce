import { db } from '../../db'
import { orders, users, orderItems, products } from '../../db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import { mapOrderToDTO } from '~~/server/dtos/order.dto'

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
    let dbOrders
    if (user.role === 'admin') {
      dbOrders = await db.select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
    } else {
      dbOrders = await db.select()
        .from(orders)
        .where(eq(orders.userId, session.data.userId))
        .orderBy(desc(orders.createdAt))
    }

    if (dbOrders.length === 0) {
      return []
    }

    const orderIds = dbOrders.map(o => o.id)
    const dbItems = await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      size: orderItems.size,
      price: orderItems.price,
      productName: products.name,
      productImages: products.images,
      collectionId: products.collectionId
    })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(inArray(orderItems.orderId, orderIds))

    return dbOrders.map((order) => {
      const itemsForOrder = dbItems.filter(item => item.orderId === order.id)
      return mapOrderToDTO(order, itemsForOrder)
    })
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
