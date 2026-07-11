import { z } from 'zod'

export const discountCodeSchemaBase = z.object({
  code: z.string()
    .min(3, { message: 'El código debe tener al menos 3 caracteres' })
    .regex(/^[A-Z0-9_-]+$/, {
      message: 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'
    }),
  discountType: z.enum(['percent', 'price'], {
    message: 'Debes seleccionar un tipo de descuento'
  }),
  apply: z.enum(['shipping', 'cartPrice'], {
    message: 'Debes seleccionar a qué se aplica'
  }),
  discount: z.number({
    message: 'El descuento debe ser un número'
  }).positive({ message: 'El descuento debe ser mayor que 0' })
})

export const discountCodeSchema = discountCodeSchemaBase.refine((data) => {
  if (data.discountType === 'percent') {
    return data.discount <= 100
  }
  return true
}, {
  message: 'El descuento porcentual no puede superar el 100%',
  path: ['discount']
})

export type DiscountCodeSchemaOutput = z.output<typeof discountCodeSchema>
