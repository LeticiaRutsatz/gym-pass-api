import { prisma } from '@/lib' 
import { UsersRepositoryInterface } from '@/utils/interfaces/user.interface'
import { Prisma, User } from '@prisma/client'

export class UsersRepository implements UsersRepositoryInterface {

  async findById(id: string){
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