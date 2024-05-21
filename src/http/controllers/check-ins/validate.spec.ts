import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Validate check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const token = await createAndAuthenticateUser(app)

    const gym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: null,
        phone: null,
        latitude: -16.072455,
        longitude: -47.972195,
      })

    const { checkIn } = (
      await request(app.server)
        .post(`/gyms/${gym.body.gym.id}/check-ins`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          latitude: -16.072455,
          longitude: -47.972195,
        })
    ).body

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
