import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for a new gym', async () => {
    const token = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: null,
        phone: null,
        latitude: -16.072455,
        longitude: -47.972195,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS Gym',
        description: null,
        phone: null,
        latitude: -16.072455,
        longitude: -47.972195,
      })

    const searchGymResponse = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'JS',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(searchGymResponse.statusCode).toEqual(200)

    expect(searchGymResponse.body.gyms).toHaveLength(1)

    expect(searchGymResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JS Gym',
      }),
    ])
  })
})
