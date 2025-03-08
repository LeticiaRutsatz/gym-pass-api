import { Gym, Prisma } from '@prisma/client'

export interface GymsServiceInterface {
  userId: string,
  gymId: string
}

export interface GymsServiceResponse {
  Gyms: Gym
}

export interface GymsRepositoryInterface {
  findById(id: string): Promise<Gym | null> 
}