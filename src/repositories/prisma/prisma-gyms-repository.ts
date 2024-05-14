import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearByParams, GymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })

    return gym
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearByParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT *, (6371 * acos(
        cos(radians(${latitude})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(latitude))
      )) AS dist
      FROM gym
      HAVING dist <= 10;
    `

    return gyms
  }
}
