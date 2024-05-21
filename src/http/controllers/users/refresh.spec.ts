import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Refresh token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh the token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Do',
      email: 'johndo@example.com',
      password: '12345678',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndo@example.com',
      password: '12345678',
    })

    const cookies = authResponse.get('Set-Cookie')

    if (!cookies) throw new Error('Missing cookies')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body.token).toEqual(expect.any(String))
  })
})
