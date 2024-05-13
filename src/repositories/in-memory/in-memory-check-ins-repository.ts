import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)

    return checkIn ?? null
  }

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

    return checkInOnSameDate ?? null
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async countByUserId(userId: string) {
    const count = this.items.reduce(
      (sum, item) => (item.user_id === userId ? sum + 1 : sum),
      0,
    )

    return count
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) this.items[checkInIndex] = checkIn

    return checkIn
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
