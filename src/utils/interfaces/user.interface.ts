import { Prisma, User } from '@prisma/client'

export interface UserServiceInterface{
    name: string,
    email: string,
    password: string
}

export interface UserServiceResponse {
    user: User
}

export interface GetUserProfileServiceInterface{
    userId: string
}

export interface GetUserProfileServiceResponse {
    user: User
}

export interface UsersRepositoryInterface {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}