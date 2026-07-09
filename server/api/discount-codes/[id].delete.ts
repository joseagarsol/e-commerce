import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapDiscountCodeEntityToDiscountCode } from '~~/server/mappers/discountCodes'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const idParam = getRouterParam(event, 'id')

    if (!idParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID del cupón no proporcionado'
      })
    }

    const result = await db.delete(discountCodes)
      .where(eq(discountCodes.id, idParam))
      .returning()

    const [deletedDiscountCode] = result
    if (!deletedDiscountCode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cupón no encontrado'
      })
    }

    const message = 'Cupón eliminado con éxito'
    const mappedDiscountCode = mapDiscountCodeEntityToDiscountCode(deletedDiscountCode)

    return deletedResponse<DiscountCode>(message, mappedDiscountCode)
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al eliminar el cupón de la base de datos'
    })
  }
})
