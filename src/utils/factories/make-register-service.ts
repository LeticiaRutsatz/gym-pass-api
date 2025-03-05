import { UsersRepository } from '@/repositories/users.repository'
import { RegisterService } from '@/services/register.service'

// factory pattern to centralize the service dependencies
// and facilitate service calls in the controller

export function makeRegisterService() {
  const usersRepository = new UsersRepository()
  const registerService = new RegisterService(usersRepository)

  return registerService
}