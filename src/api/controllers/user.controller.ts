import {FastifyRequest, FastifyReply} from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists.error'; 
import { makeUserService } from '@/utils/factories/make-user-service';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const requiredBody = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = requiredBody.parse(request.body);
  try{

    const registerService = makeUserService();
    
    //or could be
    // const usersRepository = new UsersRepository();
    // const registerService = new RegisterService(usersRepository);

    await registerService.createUser({
      name, 
      email, 
      password
    });

    return reply.status(201).send();
  }catch(err){
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err;
  }
}

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send()
}