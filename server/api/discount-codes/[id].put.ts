import { z } from 'zod'
import { eq, and, ne } from 'drizzle-orm'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'
import { requireAdmin } from '~~/server/utils/auth'

const discountCodeSchema = z.object({
  code: z.string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .regex(/^[A-Z0-9_-]+$/, 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'),
  discountType: z.enum(['percent', 'price']),
  apply: z.enum(['shipping', 'cartPrice']),
  discount: z.number({ message: 'El descuento debe ser un número' })
    .positive('El descuento debe ser mayor que 0')
}).refine((data) => {
  if (data.discountType === 'percent') {
    return data.discount <= 100
  }
  return true
}, {
  message: 'El descuento porcentual no puede superar el 100%',
  path: ['discount']
})

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

    const dbInput = mapDTOToDB(validatedData)

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

    return {
      success: true,
      message: 'Cupón actualizado correctamente',
      updatedCoupon: mapDiscountToDTO(updatedCoupon)
    }
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
