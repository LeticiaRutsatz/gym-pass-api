import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt';
import { nearby, create, search } from '../controllers/gyms.controller';
import { verifyUserRole } from '../middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) //will verify if the user is authenticated

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}