import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export class CreateGymUseCase {
  private gymsRepository: GymsRepository

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute(data: CreateGymRequest) {
    const gym = await this.gymsRepository.create(data)

    return gym
  }
}
