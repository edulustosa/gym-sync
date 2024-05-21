import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for a nearby gym', async () => {
    const token = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'nearby gym',
        description: null,
        phone: null,
        latitude: -16.0666062,
        longitude: -47.9801061,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'far away gym',
        description: null,
        phone: null,
        latitude: -15.8355473,
        longitude: -47.9586994,
      })

    const nearbyGymsResponse = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -16.072455,
        longitude: -47.972195,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(nearbyGymsResponse.statusCode).toEqual(200)

    expect(nearbyGymsResponse.body.gyms).toHaveLength(1)

    expect(nearbyGymsResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'nearby gym',
      }),
    ])
  })
})
