import { z } from 'zod'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { mapDiscountCodeEntityToDiscountCode } from '~~/server/mappers/discountCodes'
import { discountCodeSchema } from '~~/shared/validations/discountCode'

const couponSchema = discountCodeSchema.pick({ code: true })

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = couponSchema.parse(body)

    const normalizedCode = validatedData.code.trim().toUpperCase()

    const [discountCode] = await db.select()
      .from(discountCodes)
      .where(eq(discountCodes.code, normalizedCode))

    if (!discountCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Código de descuento no es válido o ha caducado'
      })
    }

    const mappedDiscountCode = mapDiscountCodeEntityToDiscountCode(discountCode)
    const message = 'cupón aplicado con éxito'

    return validatedDataResponse<DiscountCode>(message, mappedDiscountCode)
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de código inválido',
        data: flattened.fieldErrors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al validar el código de descuento'
    })
  }
})
