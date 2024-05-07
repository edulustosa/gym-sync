import { describe, it, assert, beforeEach, expect, vi, afterEach } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const userLatitude = -16.0711898
const userLongitude = -47.9834084

describe('Check ins use-case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JS gym',
      phone: '',
      description: 'any',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
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
    ).rejects.toBeInstanceOf(Error)
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
      id: 'gym-01',
      title: 'JS gym',
      phone: '',
      description: 'any',
      latitude: new Decimal(-16.059099),
      longitude: new Decimal(-48.0396044),
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})