import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetrics = makeGetUserMetricsUseCase()

  const userId = request.user.sub
  const checkInsCount = await getUserMetrics.execute(userId)

  return reply.status(200).send({ checkInsCount })
}
