import { compare, hash } from 'bcryptjs'
import { expect, describe, it, beforeEach} from 'vitest'
import { UserService } from '@/services/user.service'
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists.error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFound } from '@/utils/errors/resource-not-found.error'

let usersRepository: InMemoryUsersRepository
let sut: UserService

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserService(usersRepository)
  })

  it('should be able to register', async () => {

    const { user } = await sut.createUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })


    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.createUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {

    const email = 'johndoe@example.com'

    await sut.createUser({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.createUser({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.getUserProfile({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })
  
    it('should not be able to get user profile with wrong id', async () => {
      await expect(() =>
        sut.getUserProfile({
          userId: 'non-existing-id',
        }),
      ).rejects.toBeInstanceOf(ResourceNotFound)
    })
})