import { prisma } from '@/lib' 
import { CheckIn, Prisma, User } from '@prisma/client'
import { CheckInRepositoryInterface } from '@/utils/interfaces/checkin.interface';

export class CheckInRepository implements CheckInRepositoryInterface {

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async findByUserIdAndDate(userId: string, date: Date){
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: date
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId
      }
    })

    return checkIns.slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string): Promise<number> {
    const numberOfCheckIns = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })

    return numberOfCheckIns
  }
}