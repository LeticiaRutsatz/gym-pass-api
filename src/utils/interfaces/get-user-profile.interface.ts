import { User } from '@prisma/client'

export interface GetUserProfileServiceInterface{
    userId: string
}

export interface GetUserProfileServiceResponse {
    user: User
}