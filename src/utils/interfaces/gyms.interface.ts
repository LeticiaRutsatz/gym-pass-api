import { Gym, Prisma } from '@prisma/client'

export interface GymsServiceInterface {
  title: string,
  description: string | null,
  phone: string | null,
  latitude: number,
  longitude: number,
}

export interface GymsServiceResponse {
  gym: Gym
}

export interface GymsRepositoryInterface {
  findById(id: string): Promise<Gym | null> 
  create(data: Prisma.GymCreateInput): Promise<Gym>
}