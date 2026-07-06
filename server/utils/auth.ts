import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')

  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false
  const hashedPassword = scryptSync(password, salt, 64).toString('hex')

  return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(hash, 'hex'))
}

export async function getAuthSession(event: H3Event) {
  const config = useRuntimeConfig(event)

  return await useSession<{ userId: string }>(event, {
    name: 'session',
    password: config.sessionPassword
  })
}

export async function requireAdmin(event: H3Event) {
  const session = await getAuthSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No estás autenticado'
    })
  }

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.data.userId))
    .limit(1)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado'
    })
  }

  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos de administrador'
    })
  }

  return user
}
