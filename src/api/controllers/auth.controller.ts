import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { InvalidCredentials } from '@/utils/errors/invalid-credentials.error'; 
import { makeAuthService } from '@/utils/factories/make-auth-service';

export async function auth(request: FastifyRequest, reply: FastifyReply){
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(8),
    });

    const {email, password} = requiredBody.parse(request.body);
    try{
        const authService = makeAuthService();

        // or could be
        // const usersRepository = new UsersRepository();
        // const authService = new AuthService(usersRepository);

        await authService.execute({
            email,
            password
        });

        return reply.status(201).send();
    }catch(err){
        if (err instanceof InvalidCredentials) {
            return reply.status(409).send({ message: err.message })
        }
        
        throw err;
    }
}