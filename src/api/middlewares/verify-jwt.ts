import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify() //verify if the token was created by this application
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}