import { prisma } from '@/lib'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
  email = 'leticia@example.com'
) {

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email,
      password_hash: await hash('12345678', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password: '12345678',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}