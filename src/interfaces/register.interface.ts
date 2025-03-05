import { User } from '@prisma/client'
export interface RegisterServiceInterface{
    name: string,
    email: string,
    password: string
}

export interface RegisterUseCaseResponse {
    user: User
  }