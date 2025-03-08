import { prisma } from '@/lib' 
import { Gym, Prisma, User } from '@prisma/client'
import { GymsRepositoryInterface } from '@/utils/interfaces/gyms.interface';

export class GymsRepository implements GymsRepositoryInterface {
  create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = prisma.gym.create({
      data
    })

    return gym
  }

  findById(id: string): Promise<Gym | null> {
    const gym = prisma.gym.findUnique({
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
}