import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt';
import { nearby, create, search } from '../controllers/gyms.controller';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) //will verify if the user is authenticated

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
}