import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const currDay = date.getDate()
    const currMonth = date.getMonth()

    const checkInOnSameDate = this.items.find((item) => {
      const storageDay = item.created_at.getDate()
      const storageMonth = item.created_at.getMonth()

      return (
        item.user_id === userId &&
        currDay === storageDay &&
        storageMonth === currMonth
      )
    })

    return checkInOnSameDate || null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
