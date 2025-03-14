import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  
  async setup() { //before each test
    const schema = randomUUID() //change schema of the db to create a separate db enviroment to each test
    const databaseURL = generateDatabaseURL(schema);
    console.log('Setup:', databaseURL);
    
    process.env.DATABASE_URL = databaseURL;
    execSync('npx prisma migrate deploy'); //execute a command in terminal

    return {
      async teardown() { //after each test
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}