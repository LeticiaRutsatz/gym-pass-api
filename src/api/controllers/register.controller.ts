import {FastifyRequest, FastifyReply} from 'fastify';
import { z } from 'zod';
import { RegisterService } from '@/services/register.service';
import { UsersRepository } from '@/repositories/users.repository';
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists.error'; 
import { makeRegisterService } from '@/utils/factories/make-register-service';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requiredBody = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = requiredBody.parse(request.body);
  try{

    const registerService = makeRegisterService();
    
    //or could be
    // const usersRepository = new UsersRepository();
    // const registerService = new RegisterService(usersRepository);

    await registerService.execute({
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