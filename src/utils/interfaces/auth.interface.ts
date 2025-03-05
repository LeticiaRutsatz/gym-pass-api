import { User } from '@prisma/client'

export interface AuthServiceInterface {
    email: string,
    password: string
}

export interface AuthServiceResponse {
    user: User
}