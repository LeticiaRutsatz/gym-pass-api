import { prisma } from '@/lib' 
import { CheckIn, Prisma, User } from '@prisma/client'
import { CheckInRepositoryInterface } from '@/utils/interfaces/checkin.interface';
import dayjs from 'dayjs';

export class CheckInRepository implements CheckInRepositoryInterface {

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const numberOfCheckIns = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })

    return numberOfCheckIns
  }

  async findById(id: string){
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn;
  }

  async save(checkIn: CheckIn){
    const checkInUpdated = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })
    
    return checkInUpdated;
  }

}