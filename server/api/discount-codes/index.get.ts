import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapDiscountCodeEntityToDiscountCode } from '~~/server/mappers/discountCodes'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const allCoupons = await db.select().from(discountCodes)

    return allCoupons.map(mapDiscountCodeEntityToDiscountCode)
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los códigos de descuento de la base de datos'
    })
  }
})
