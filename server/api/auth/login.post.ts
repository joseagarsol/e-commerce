import { z } from 'zod'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/auth'

const schema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = schema.parse(body)
    const { email, password } = validatedData
    const normalizedEmail = email.toLowerCase()

    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'El correo electrónico o la contraseña son incorrectos'
      })
    }

    const session = await getAuthSession(event)

    await session.update({
      userId: user.id
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
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
      statusMessage: 'Error al iniciar sesión'
    })
  }
})
