import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'


describe('Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true, 'leticia1@test.com')

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -23.2092872,
        longitude: -12.6407881,
      })
    expect(response.statusCode).toEqual(201)
  })

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true, 'leticia2@test.com')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Python Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
    })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -25.0610928,
        longitude: -45.5229501,
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Python Gym',
      }),
    ])
  })
})