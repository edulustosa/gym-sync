import { CheckInsRepository } from '@/repositories/check-ins-repository'

export class GetUserMetricsUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute(userId: string) {
    const count = await this.checkInsRepository.countByUserId(userId)

    return count
  }
}
