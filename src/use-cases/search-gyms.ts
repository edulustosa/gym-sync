import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsRequest {
  query: string
  page: number
}

export class SearchGymsUseCase {
  private gymsRepository: GymsRepository

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({ query, page }: SearchGymsRequest) {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return gyms
  }
}
