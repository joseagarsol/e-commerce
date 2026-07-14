import 'dotenv/config'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from '../server/db'

async function main() {
  console.log('Aplicando migraciones a la base de datos...')
  try {
    await migrate(db, { migrationsFolder: './server/db/migrations' })
    console.log('¡Migraciones aplicadas con éxito!')
    process.exit(0)
  } catch (error) {
    console.error('Error aplicando las migraciones:', error)
    process.exit(1)
  }
}

main()
