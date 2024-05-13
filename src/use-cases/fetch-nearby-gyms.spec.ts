import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

const latitude = -16.072455
const longitude = -47.972195

describe('Fetch nearby gyms use-case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'nearby gym',
      description: null,
      phone: null,
      latitude: -16.0666062,
      longitude: -47.9801061,
    })

    await gymsRepository.create({
      title: 'far away gym',
      description: null,
      phone: null,
      latitude: -15.8355473,
      longitude: -47.9586994,
    })

    const nearbyGyms = await sut.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(nearbyGyms).toHaveLength(1)

    expect(nearbyGyms).toEqual([
      expect.objectContaining({ title: 'nearby gym' }),
    ])
  })
})
