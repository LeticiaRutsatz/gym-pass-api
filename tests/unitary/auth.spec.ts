
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthService } from '@/services/auth.service'
import { InvalidCredentials } from '@/utils/errors/invalid-credentials.error'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'


let usersRepository: InMemoryUsersRepository
let sut: AuthService

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthService(usersRepository)
  })

  it('should be able to authenticate', async () => {

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with wrong email', async () => {

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })
  
})