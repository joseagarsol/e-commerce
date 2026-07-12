import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { db } from '../../db'
import { orders, orderItems, products, discountCodes } from '../../db/schema'
import { eq, inArray } from 'drizzle-orm'
import { checkoutApiSchema as checkoutSchema } from '~~/shared/validations/order'

const getBaseShippingPrice = (method: string): number => {
  switch (method) {
    case 'pickup': return 0
    case 'express': return 9.99
    case 'standard':
    default:
      return 3.99
  }
}

const calculateDiscount = (price: number, discountType: 'percent' | 'price', amount: number): number => {
  let discountedPrice = price
  if (discountType === 'percent') {
    discountedPrice = price - (price * amount)
  } else if (discountType === 'price') {
    discountedPrice = price - amount
  }
  return Math.max(0, discountedPrice)
}

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
    const { billingAddress, shipping, payment, cartItems: items, totalPrice: clientTotalPrice, promoCode } = validatedData

    const productIds = items.map(item => item.id)

    const dbProducts = await db
      .select({
        id: products.id,
        price: products.price,
        name: products.name,
        stock: products.stock,
        stockBySize: products.stockBySize
      })
      .from(products)
      .where(inArray(products.id, productIds))

    const dbProductsMap = new Map(dbProducts.map(p => [p.id, p]))

    let serverSubtotal = 0
    const verifiedItems: Array<typeof items[number] & { dbProduct: typeof dbProducts[number] }> = []

    for (const item of items) {
      const dbProduct = dbProductsMap.get(item.id)
      if (!dbProduct) {
        throw createError({
          statusCode: 400,
          statusMessage: `El producto con ID ${item.id} no existe`
        })
      }
      // Validamos stock disponible
      if (item.selectedSize && dbProduct.stockBySize) {
        const currentSizeStock = dbProduct.stockBySize[item.selectedSize] ?? 0
        if (currentSizeStock < item.quantity) {
          throw createError({
            statusCode: 400,
            statusMessage: `Stock insuficiente para la prenda "${dbProduct.name}" en talla ${item.selectedSize}.`
          })
        }
      } else {
        if (dbProduct.stock < item.quantity) {
          throw createError({
            statusCode: 400,
            statusMessage: `Stock insuficiente para la prenda "${dbProduct.name}".`
          })
        }
      }

      const itemRealPrice = dbProduct.price
      serverSubtotal += itemRealPrice * item.quantity

      verifiedItems.push({
        ...item,
        price: itemRealPrice,
        dbProduct
      })
    }

    let serverShippingPrice = getBaseShippingPrice(shipping.method)

    if (serverSubtotal >= 25) {
      serverShippingPrice = Math.max(0, serverShippingPrice - 3.99)
    }

    let serverTotalPrice = serverSubtotal + serverShippingPrice

    if (promoCode) {
      const normalizedCode = promoCode.trim().toUpperCase()
      const [dbCoupon] = await db
        .select()
        .from(discountCodes)
        .where(eq(discountCodes.code, normalizedCode))
        .limit(1)

      if (!dbCoupon) {
        throw createError({
          statusCode: 400,
          statusMessage: 'El cupón promocional no es válido o ha expirado'
        })
      }

      if (dbCoupon.apply === 'shipping') {
        serverShippingPrice = calculateDiscount(serverShippingPrice, dbCoupon.discountType, dbCoupon.discount)
        serverTotalPrice = serverSubtotal + serverShippingPrice
      } else if (dbCoupon.apply === 'cartPrice') {
        const totalBeforePromo = serverSubtotal + serverShippingPrice
        serverTotalPrice = calculateDiscount(totalBeforePromo, dbCoupon.discountType, dbCoupon.discount)
      }
    }

    if (Math.abs(serverTotalPrice - clientTotalPrice) > 0.01) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El precio total del pedido no coincide con el calculado por el servidor. Por favor, revisa tu carrito.'
      })
    }

    if (Math.abs(serverShippingPrice - shipping.price) > 0.01) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Los gastos de envío del pedido no coinciden con los calculados por el servidor.'
      })
    }

    const orderId = randomUUID()

    await db.transaction(async (tx) => {
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
        shippingPrice: serverShippingPrice,
        paymentMethod: payment.method,
        total: serverTotalPrice,
        status: 'paid'
      })

      for (const item of verifiedItems) {
        await tx.insert(orderItems).values({
          id: randomUUID(),
          orderId,
          productId: item.id,
          quantity: item.quantity,
          size: item.selectedSize,
          price: item.price
        })

        const product = item.dbProduct

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
