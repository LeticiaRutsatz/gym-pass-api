import { FastifyInstance } from 'fastify';
import { createUser, profile } from '../controllers/user.controller';
import { auth } from '../controllers/auth.controller';
import { verifyJwt } from '../middlewares/verify-jwt';

export async function usersRoutes(app: FastifyInstance){
    app.post('/users', createUser)
    app.post('/sessions', auth)

    //authentication
    app.get('/me', { onRequest: [verifyJwt] }, profile)
}