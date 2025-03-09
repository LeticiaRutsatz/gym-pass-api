import { prisma } from '@/lib' 
import { Gym, Prisma, User } from '@prisma/client'
import { FindManyNearbyParams, GymsRepositoryInterface, GymsServiceSearchNearlyInterface } from '@/utils/interfaces/gyms.interface';

export class GymsRepository implements GymsRepositoryInterface {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data
    })

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gym = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    })

    return gym.slice((page - 1) * 20, page * 20);
  }

  //TO DO
  // async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
  // }
}