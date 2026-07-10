import { z } from 'zod'
import { eq, and, ne } from 'drizzle-orm'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapDiscountCodeEntityToDiscountCode, mapDiscountCodeToDiscountCodeEntity } from '~~/server/mappers/discountCodes'
import { updatedResponse } from '~~/server/utils/response'
import { discountCodeSchema } from '~~/shared/validations/discountCode'

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

    const body = await readBody(event)
    const validatedData = discountCodeSchema.parse(body)

    const [existingCode] = await db.select()
      .from(discountCodes)
      .where(and(
        eq(discountCodes.code, validatedData.code),
        ne(discountCodes.id, idParam)
      ))
      .limit(1)

    if (existingCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El código de descuento ya está en uso por otro cupón'
      })
    }

    const dbInput = mapDiscountCodeToDiscountCodeEntity(validatedData)

    const [updatedCoupon] = await db.update(discountCodes)
      .set({
        ...dbInput
      })
      .where(eq(discountCodes.id, idParam))
      .returning()

    if (!updatedCoupon) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cupón no encontrado'
      })
    }

    const message = 'Cupón actualizado con éxito'
    const mappedDiscountCode = mapDiscountCodeEntityToDiscountCode(updatedCoupon)

    return updatedResponse<DiscountCode>(message, mappedDiscountCode)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de cupón inválidos',
        data: flattened.fieldErrors
      })
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al actualizar el cupón en la base de datos'
    })
  }
})
