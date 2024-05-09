import { describe, it, assert, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

const latitude = -16.072455
const longitude = -47.972195

describe('Create gym use-case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const gym = await sut.execute({
      title: 'JS gym',
      description: null,
      phone: null,
      latitude,
      longitude,
    })

    assert.exists(gym)
  })
})
