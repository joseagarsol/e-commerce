import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'
import { mapDiscountCodeEntityToDiscountCode, mapDiscountCodeToDiscountCodeEntity } from '~~/server/mappers/discountCodes'
import { discountCodeSchema } from '~~/shared/validations/discountCode'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const body = await readBody(event)
    const validatedData = discountCodeSchema.parse(body)

    const [existingCode] = await db.select()
      .from(discountCodes)
      .where(eq(discountCodes.code, validatedData.code))

    if (existingCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El código de descuento ya existe'
      })
    }

    const couponId = crypto.randomUUID()
    const dbInput = mapDiscountCodeToDiscountCodeEntity(validatedData)

    const [newCoupon] = await db.insert(discountCodes).values({
      id: couponId,
      ...dbInput
    }).returning()

    if (!newCoupon) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear el cupón'
      })
    }

    setResponseStatus(event, 201)
    const message = 'Cupón creado con éxito'
    const mappedDiscountCode = mapDiscountCodeEntityToDiscountCode(newCoupon)

    return createdResponse<DiscountCode>(message, mappedDiscountCode)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de cupón inválidos',
        data: flattened.fieldErrors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al guardar el cupón en la base de datos'
    })
  }
})
