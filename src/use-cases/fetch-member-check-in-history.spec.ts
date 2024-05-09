import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchMemberCheckInHistoryUseCase } from './fetch-member-check-in-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchMemberCheckInHistoryUseCase

describe('Fetch member check-in history', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchMemberCheckInHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch user check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const checkIn = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIn).toHaveLength(2)

    expect(checkIn).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const checkIn = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIn).toHaveLength(2)

    expect(checkIn).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
