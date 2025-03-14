import { FastifyInstance } from 'fastify';
import { createUser, profile } from '../controllers/user.controller';
import { auth } from '../controllers/auth.controller';

export async function appRoutes(app: FastifyInstance){
    app.post('/users', createUser)
    app.post('/sessions', auth)

    //authentication
    app.get('/me', profile)
}