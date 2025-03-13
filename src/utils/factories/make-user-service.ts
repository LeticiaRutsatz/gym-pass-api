import { UsersRepository } from '@/repositories/users.repository'
import { UserService } from '@/services/user.service'

// factory pattern to centralize the service dependencies
// and facilitate service calls in the controller

export function makeUserService() {
  const usersRepository = new UsersRepository();
  const service = new UserService(usersRepository);

  return service;
}