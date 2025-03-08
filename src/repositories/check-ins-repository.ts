import { prisma } from '@/lib' 
import { Prisma, User } from '@prisma/client'
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
}