import { z } from 'zod'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { registerSchema as schema } from '~~/shared/validations/register'

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

    const session = await getAuthSession(event)
    await session.update({ userId })

    return {
      id: userId,
      name,
      email: normalizedEmail,
      role: 'customer'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de usuario inválidos',
        data: flattened.fieldErrors
      })
    }

    if (error instanceof Error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error al registrar el usuario'
    })
  }
})
