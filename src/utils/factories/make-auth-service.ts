import { UsersRepository } from '@/repositories/users.repository'
import { AuthService } from '@/services/auth.service'

// factory pattern to centralize the service dependencies
// and facilitate service calls in the controller

export function makeAuthService() {
  const usersRepository = new UsersRepository()
  const authService = new AuthService(usersRepository)

  return authService
}