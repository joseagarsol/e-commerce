import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

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
    password: config.sessionSecret
  })
}
