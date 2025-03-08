import { prisma } from '@/lib' 
import { Gym, Prisma, User } from '@prisma/client'
import { GymsRepositoryInterface } from '@/utils/interfaces/gyms.interface';

export class GymsRepository implements GymsRepositoryInterface {
  findById(id: string): Promise<Gym | null> {
      const gym = prisma.gym.findUnique({
        where: {
          id,
        },
      })

      return gym
  }
}