
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkIn-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInService } from '@/services/checkin.service'
import { MaxDistanceError } from '@/utils/errors/max-distance.error'
import { MaxNumberOfCheckInsError } from '@/utils/errors/max-numbers-of-check-ins.error'
import { ResourceNotFound } from '@/utils/errors/resource-not-found.error'
import { Decimal } from '@prisma/client/runtime/library'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'


let checkInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to checkIn', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkIn twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.searchCheckInHistory({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.searchCheckInHistory({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.getNumberOfCheckings({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })

  it('should be able to validate the check-in', async () => {
    vi.useRealTimers();

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.validateCheckIn({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    vi.useRealTimers();

    await expect(() =>
      sut.validateCheckIn({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) //set the new date

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21 //avance in time

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.validateCheckIn({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})