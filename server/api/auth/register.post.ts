import { z } from 'zod'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

const schema = z.object({
  name: z.string().min(2, 'Debe tener al menos 2 caracteres'),
  email: z.email('Correo inválido'),
  password: z.string().min(8, 'Debe tener al menos 8 caracteres')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = schema.parse(body)

    const { name, email, password } = validatedData
    const normalizedEmail = email.toLowerCase()

    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'El correo electrónico ya está registrado'
      })
    }

    const passwordHash = hashPassword(password)
    const userId = randomUUID()

    await db.insert(users).values({
      id: userId,
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'customer'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de usuario inválidos',
        data: flattened.fieldErrors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al registrar el usuario'
    })
  }
})
