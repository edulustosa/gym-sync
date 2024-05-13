import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

const latitude = -16.072455
const longitude = -47.972195

describe('Search gyms use-case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search a gym by title', async () => {
    await gymsRepository.create({
      title: 'JS gym',
      description: null,
      phone: null,
      latitude,
      longitude,
    })

    await gymsRepository.create({
      title: 'JS gym',
      description: null,
      phone: null,
      latitude: -16.072461,
      longitude: -47.972181,
    })

    const gyms = await sut.execute({
      query: 'JS gym',
      page: 1,
    })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS gym' }),
      expect.objectContaining({ title: 'JS gym' }),
    ])
  })

  it('should be able to search paginated gym by query', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JS gym ${i}`,
        description: null,
        phone: null,
        latitude,
        longitude,
      })
    }

    const gyms = await sut.execute({
      query: 'JS gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS gym 21' }),
      expect.objectContaining({ title: 'JS gym 22' }),
    ])
  })
})
