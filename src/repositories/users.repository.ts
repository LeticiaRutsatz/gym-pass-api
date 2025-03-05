import { prisma } from '@/lib' 
import { Prisma } from '@prisma/client'
import { UsersRepositoryInterface } from '@/utils/interfaces/usersRepository.interface';

export class UsersRepository implements UsersRepositoryInterface { //implements interface to set what methods the repository must have
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}