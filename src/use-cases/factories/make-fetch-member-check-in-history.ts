import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchMemberCheckInHistoryUseCase } from '../fetch-member-check-in-history'

export function makeFetchMemberCheckInHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const fetchMemberCheckInHistoryUseCase = new FetchMemberCheckInHistoryUseCase(
    checkInsRepository,
  )

  return fetchMemberCheckInHistoryUseCase
}
