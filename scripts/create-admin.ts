import 'dotenv/config'
import { db } from '../server/db'
import { users } from '../server/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID, randomBytes, scryptSync } from 'node:crypto'
import * as readline from 'node:readline'
import { Writable } from 'node:stream'

class MutableStdout extends Writable {
  muted = false

  override _write(chunk: string | Uint8Array, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding)
    }
    callback()
  }
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const mutableStdout = new MutableStdout()

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
})

const question = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve))
}

const questionHidden = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    mutableStdout.muted = false
    process.stdout.write(query)
    mutableStdout.muted = true
    rl.question('', (answer) => {
      mutableStdout.muted = false
      process.stdout.write('\n')
      resolve(answer)
    })
  })
}

async function main() {
  try {
    let name = process.argv[2]
    let email = process.argv[3]
    let password = process.argv[4]

    if (!name || !email || !password) {
      console.log('--- Creando Usuario Administrador ---')
      if (!name) {
        name = await question('Nombre del administrador: ')
      }
      if (!email) {
        email = await question('Correo electrónico (email): ')
      }
      if (!password) {
        password = await questionHidden('Contraseña (mínimo 8 caracteres): ')
      }
    }

    name = name.trim()
    email = email.trim().toLowerCase()
    password = password.trim()

    if (!name || !email || !password) {
      console.error('Error: Todos los campos son obligatorios.')
      process.exit(1)
    }

    if (password.length < 8) {
      console.error('Error: La contraseña debe tener al menos 8 caracteres.')
      process.exit(1)
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`El usuario con email ${email} ya existe y es administrador.`)
        process.exit(0)
      }

      const confirmUpgrade = await question(`El usuario con email ${email} ya existe pero tiene el rol '${existingUser.role}'. ¿Deseas cambiar su rol a 'admin'? (s/n): `)
      if (confirmUpgrade.toLowerCase() === 's' || confirmUpgrade.toLowerCase() === 'si') {
        await db.update(users)
          .set({ role: 'admin' })
          .where(eq(users.id, existingUser.id))
        console.log(`¡Éxito! El rol del usuario ${email} ha sido actualizado a 'admin'.`)
      } else {
        console.log('Operación cancelada.')
      }
      process.exit(0)
    }

    const passwordHash = hashPassword(password)
    const userId = randomUUID()

    await db.insert(users).values({
      id: userId,
      name,
      email,
      passwordHash,
      role: 'admin'
    })

    console.log(`\n¡Éxito! Usuario administrador creado correctamente:`)
    console.log(`- ID: ${userId}`)
    console.log(`- Nombre: ${name}`)
    console.log(`- Email: ${email}`)
    console.log(`- Rol: admin`)
  } catch (error) {
    console.error('Ocurrió un error al crear el usuario administrador:', error)
  } finally {
    rl.close()
  }
}

main()
