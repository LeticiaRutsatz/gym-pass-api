import { randomUUID } from 'node:crypto';
import { CheckInRepository } from '../check-ins-repository';
import { Prisma, CheckIn } from '@prisma/client'
import dayjs from 'dayjs';

export class InMemoryCheckInRepository implements CheckInRepository {
  public items: CheckIn[] = []
    
  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date') // get the start of the day
    const endOfTheDay = dayjs(date).endOf('date') // get the end of the day

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }
  
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }
}