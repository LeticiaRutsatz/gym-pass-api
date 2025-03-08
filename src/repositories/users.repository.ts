import { prisma } from '@/lib' 
import { Prisma, User } from '@prisma/client'
import { UsersRepositoryInterface } from '@/utils/interfaces/usersRepository.interface';

export class UsersRepository implements UsersRepositoryInterface {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  } 

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    })

    return user
  }
}