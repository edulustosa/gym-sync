import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

let token: string

describe('Get profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    await request(app.server).post('/users').send({
      name: 'John Do',
      email: 'johndo@example.com',
      password: '12345678',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndo@example.com',
      password: '12345678',
    })

    token = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)

    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'John Do',
        email: 'johndo@example.com',
      }),
    )
  })
})
