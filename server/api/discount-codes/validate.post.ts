import { z } from 'zod'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { eq } from 'drizzle-orm'
import type { ApiResponse } from '~/types/api'
import type { Promotion } from '~/types/promotion'

const couponSchema = z.object({
  code: z.string().min(1, 'El código es requerido')
})

export default defineEventHandler(async (event): Promise<ApiResponse<Promotion>> => {
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

    return {
      success: true,
      message: 'Código de descuento aplicado con éxito',
      data: {
        code: discountCode.code,
        discount: discountCode.discount,
        discountType: discountCode.discountType,
        apply: discountCode.apply
      }
    }
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
