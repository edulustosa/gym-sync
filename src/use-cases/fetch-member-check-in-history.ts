import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchMemberCheckInHistoryRequest {
  userId: string
  page: number
}

export class FetchMemberCheckInHistoryUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({ userId, page }: FetchMemberCheckInHistoryRequest) {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return checkIns
  }
}
