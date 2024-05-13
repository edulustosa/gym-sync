import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearByParams, GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findManyNearby(user: FindManyNearByParams) {
    return this.items.filter((item) => {
      const gymDistance = getDistanceBetweenCoordinates(
        {
          latitude: user.latitude,
          longitude: user.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return gymDistance < 10000
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    return gym ?? null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }
}
