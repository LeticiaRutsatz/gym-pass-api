import { prisma } from '@/lib' 
import { Gym, Prisma, User } from '@prisma/client'
import { FindManyNearbyParams, GymsRepositoryInterface, GymsServiceSearchNearlyInterface } from '@/utils/interfaces/gyms.interface';

export class GymsRepository implements GymsRepositoryInterface {
  
  async create(data: Prisma.GymCreateInput){
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findById(id: string){
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10 //
    `
    //The Haversine Formula is used to calculate the distance between two points on a globe. The result is multiplied by 6371 to obtain the distance in kilometers.

    return gyms
  }
}