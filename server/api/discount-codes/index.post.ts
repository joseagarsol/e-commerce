import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { discountCodes } from '../../db/schema'

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

    const [newCoupon] = await db.insert(discountCodes).values({
      id: couponId,
      code: validatedData.code,
      discountType: validatedData.discountType,
      apply: validatedData.apply,
      discount: validatedData.discount
    }).returning()

    setResponseStatus(event, 201)
    return newCoupon
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
