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

export interface GymsServiceSearchInterface {
  query: string,
  page: number,
}

export interface GymsServiceSearchResponse {
  gyms: Gym[]
}

export interface GymsServiceSearchNearlyInterface {
  userLatitude: number,
  userLongitude: number,
}
export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}
export interface GymsRepositoryInterface {
  findById(id: string): Promise<Gym | null> 
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}