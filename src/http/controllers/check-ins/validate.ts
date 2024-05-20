import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInQuerySchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInQuerySchema.parse(request.body)

  const validateCheckIn = makeValidateCheckInUseCase()

  await validateCheckIn.execute({ checkInId })

  return reply.status(204).send()
}
