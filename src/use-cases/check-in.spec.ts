import { describe, it, assert, beforeEach, expect, vi, afterEach } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const userLatitude = -16.072455
const userLongitude = -47.972195

describe('Check ins use-case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS gym',
      description: null,
      phone: null,
      latitude: userLatitude,
      longitude: userLongitude,
    })

    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkIn = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude,
      userLongitude,
    })

    assert.exists(checkIn)
  })

  // TDD -> red -> green -> refactor

  it('should not be possible to check in twice a day', async () => {
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude,
      userLongitude,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be possible to check in twice but in different days', async () => {
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude,
      userLongitude,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const checkIn = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude,
      userLongitude,
    })

    assert.exists(checkIn)
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JS gym',
      phone: '',
      description: 'any',
      latitude: new Decimal(-16.0751205),
      longitude: new Decimal(-47.9761378),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
