import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { db } from '../../db'
import { orders, orderItems, products } from '../../db/schema'
import { eq } from 'drizzle-orm'

const orderItemSchema = z.object({
  id: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  selectedSize: z.string().nullable()
})

const checkoutSchema = z.object({
  billingAddress: z.object({
    email: z.email(),
    name: z.string().min(2),
    lastName: z.string().min(2),
    address: z.string().min(5),
    postalCode: z.string().length(5),
    city: z.string().min(1),
    province: z.string().min(1)
  }),
  shipping: z.object({
    method: z.string(),
    price: z.number()
  }),
  payment: z.object({
    method: z.string()
  }),
  cartItems: z.array(orderItemSchema).min(1),
  totalPrice: z.number().positive()
})

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
    const validatedData = checkoutSchema.parse(body)
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

            updatedStockBySize[item.selectedSize] = Math.max(0, currentSizeStock - item.quantity)
          }
          const newTotalStock = Math.max(0, product.stock - item.quantity)

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
