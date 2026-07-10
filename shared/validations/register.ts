import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string({ message: 'El nombre es requerido' })
      .min(6, 'El nombre debe tener al menos 6 caracteres')
      .max(20, 'El nombre debe tener menos de 20 caracteres'),
    email: z.email('Email inválido'),
    password: z.string({ message: 'La contraseña es requerida' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(60, 'La contraseña debe tener menos de 60 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    password_confirmation: z.string({ message: 'La confirmación de la contraseña es requerida' })
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation']
  })

export type RegisterSchemaOutput = z.output<typeof registerSchema>
