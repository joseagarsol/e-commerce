import { db } from '../../db'
import { discountCodes } from '../../db/schema'

export default defineEventHandler(async () => {
  try {
    const allCoupons = await db.select().from(discountCodes)
    return allCoupons
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los códigos de descuento de la base de datos'
    })
  }
})
