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

        const { user } = await authService.execute({
            email,
            password
        });

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id, //never use private information about the user
            }
        }) //create token

        const refreshToken = await reply.jwtSign({}, {
            sign: {
                sub: user.id,
                expiresIn: '7d' //before this tame the user needs to login again
            }
        }) 

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/', //wich route can read this value
                secure: true,
                sameSite: true,
                httpOnly: true,
            })
            .status(200)
            .send({
                token,
            });
    }catch(err){
        if (err instanceof InvalidCredentials) {
            return reply.status(409).send({ message: err.message })
        }
        
        throw err;
    }
}

export async function refresh(request: FastifyRequest, reply: FastifyReply){

    await request.jwtVerify({ onlyCookie: true}); //look to cookies to se if exist refresh token


    const token = await reply.jwtSign({}, {
        sign: {
            sub: request.user.sub, //never use private information about the user
        }
    }) //create token

    const refreshToken = await reply.jwtSign({}, {
        sign: {
            sub: request.user.sub,
            expiresIn: '7d' //before this tame the user needs to login again
        }
    }) 

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/', //wich route can read this value
            secure: true,
            sameSite: true,
            httpOnly: true,
        })
        .status(200)
        .send({
            token,
        });

}