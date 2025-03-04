
import 'dotenv/config' //carrega as variaveis de ambiente
import { z } from 'zod' //usado para validar se todas variaveis necessárias estão presentes

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333) //coerce coverte o valor para numero, então a porta pode ser passada como string no env
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data