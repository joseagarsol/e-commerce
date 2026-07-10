import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { db } from '../../db'
import { orders, orderItems, products } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { checkoutApiSchema as checkoutSchema } from '~~/shared/validations/order'

export default defineEventHandler(async (event) => {
  try {
    const session = await getAuthSession(event)

    if (!session.data.userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Inicia sesión para realizar el pedido'
      })
    }

    const body = await readBody(event)
    const validatedData: CreateOrderEntity = checkoutSchema.parse(body)
    const { billingAddress, shipping, payment, cartItems: items, totalPrice } = validatedData

    const orderId = randomUUID()

    await db.transaction(async (tx) => {
      // creamos el pedido
      await tx.insert(orders).values({
        id: orderId,
        userId: session.data.userId,
        email: billingAddress.email,
        name: billingAddress.name,
        lastName: billingAddress.lastName,
        address: billingAddress.address,
        postalCode: billingAddress.postalCode,
        city: billingAddress.city,
        province: billingAddress.province,
        shippingMethod: shipping.method,
        shippingPrice: shipping.price,
        paymentMethod: payment.method,
        total: totalPrice,
        status: 'paid'
      })

      // insertamos los productos del carrito y actualizamos el stock
      for (const item of items) {
        await tx.insert(orderItems).values({
          id: randomUUID(),
          orderId,
          productId: item.id,
          quantity: item.quantity,
          size: item.selectedSize,
          price: item.price
        })

        const [product] = await tx.select()
          .from(products)
          .where(eq(products.id, item.id))
          .limit(1)

        if (product) {
          const updatedStockBySize = product.stockBySize

          if (item.selectedSize && updatedStockBySize) {
            const currentSizeStock = updatedStockBySize[item.selectedSize] ?? 0

            if (currentSizeStock < item.quantity) {
              throw createError({
                statusCode: 400,
                statusMessage: `Stock insuficiente para la prenda "${product.name}" en talla ${item.selectedSize}. Disponible: ${currentSizeStock}, Solicitado: ${item.quantity}`
              })
            }

            updatedStockBySize[item.selectedSize] = currentSizeStock - item.quantity
          } else {
            if (product.stock < item.quantity) {
              throw createError({
                statusCode: 400,
                statusMessage: `Stock insuficiente para la prenda "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`
              })
            }
          }

          const newTotalStock = product.stock - item.quantity

          await tx.update(products)
            .set({
              stock: newTotalStock,
              stockBySize: updatedStockBySize
            }).where(eq(products.id, item.id))
        }
      }
    })

    return {
      success: true,
      orderId
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Datos del checkout inválidos',
        data: flattened.fieldErrors
      })
    }

    if (error instanceof Error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al guardar el pedido'
    })
  }
})
