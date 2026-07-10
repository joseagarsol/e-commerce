import { z } from 'zod'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, hashPassword } from '../../utils/auth'
import { randomUUID } from 'node:crypto'
import { loginSchema as schema } from '~~/shared/validations/login'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = schema.parse(body)
    const { email, password } = validatedData
    const normalizedEmail = email.toLowerCase()

    const demoAccounts = {
      'admin@urbanluxury.com': { name: 'Administrador Demo', role: 'admin' as const },
      'cliente@urbanluxury.com': { name: 'Cliente Demo', role: 'customer' as const }
    }

    if (normalizedEmail in demoAccounts) {
      const [existingUser] = await db.select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1)

      if (!existingUser) {
        const accountInfo = demoAccounts[normalizedEmail as keyof typeof demoAccounts]
        const hashedPassword = hashPassword(password)

        await db.insert(users).values({
          id: randomUUID(),
          name: accountInfo.name,
          email: normalizedEmail,
          passwordHash: hashedPassword,
          role: accountInfo.role
        })
      }
    }

    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'El correo electrónico o la contraseña no son incorrectos'
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
