import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchMemberCheckInHistoryUseCase } from '@/use-cases/factories/make-fetch-member-check-in-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchMemberCheckInHistory = makeFetchMemberCheckInHistoryUseCase()

  const checkIns = await fetchMemberCheckInHistory.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
