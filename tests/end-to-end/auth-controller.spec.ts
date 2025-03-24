import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'leticia@example.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'leticia@example.com',
      password: '12345678',
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should be able to refresh a token', async () => {
    const user = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'leticia@example.com',
      password: '12345678',
    })
    
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'leticia@example.com',
      password: '12345678',
    })

    const cookies = authResponse.get('Set-Cookie')
    if (!cookies) {
      throw new Error('No cookies returned from authentication response')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})