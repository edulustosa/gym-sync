import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

export class ValidateCheckInUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({ checkInId }: ValidateCheckInUseCaseRequest) {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    if (!checkIn.validated_at) {
      checkIn.validated_at = new Date()
      return checkIn
    }

    const currDateInMs = new Date().getTime()

    const distanceInMinutesFromCheckInCreation =
      currDateInMs - checkIn.validated_at.getTime()

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()
    return checkIn
  }
}
