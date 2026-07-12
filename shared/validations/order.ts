import { z } from 'zod'

export const orderItemSchema = z.object({
  id: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  selectedSize: z.string().nullable()
})

export const billingAddressSchema = z.object({
  email: z.email('El campo email no es correcto'),
  name: z.string()
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(20, 'El nombre debe tener como máximo 20 caracteres'),
  lastName: z.string()
    .min(4, 'El apellido debe tener al menos 4 caracteres')
    .max(20, 'El apellido debe tener como máximo 20 caracteres'),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(100, 'La dirección debe tener como máximo 100 caracteres'),
  postalCode: z.string().length(5, 'El código postal debe tener exactamente 5 caracteres'),
  city: z.string().min(1, 'El campo ciudad es requerido'),
  province: z.string().min(1, 'El campo provincia es requerido')
})

export const checkoutApiSchema = z.object({
  billingAddress: billingAddressSchema,
  shipping: z.object({
    method: z.string(),
    price: z.number()
  }),
  payment: z.object({
    method: z.string()
  }),
  cartItems: z.array(orderItemSchema).min(1),
  totalPrice: z.number().positive(),
  promoCode: z.string().optional()
})

export type CheckoutApiSchemaOutput = z.output<typeof checkoutApiSchema>

export const orderStatusEnum = z.enum(['pending', 'paid', 'shipped', 'cancelled'])

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum
})

export type UpdateOrderStatusSchemaOutput = z.output<typeof updateOrderStatusSchema>
