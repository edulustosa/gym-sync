import { registerService } from '@/services/register'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerService({
      name,
      email,
      password,
    })
  } catch (err) {
    console.error(err)

    return reply.code(409).send({
      error: 'Email already exists',
    })
  }

  return reply.status(201).send()
}
