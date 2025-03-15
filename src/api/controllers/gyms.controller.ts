import { makeSearchGymsService } from '@/utils/factories/make-search-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const gymService = makeSearchGymsService()

  await gymService.createGym({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })
  
    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)
  
    const gymService = makeSearchGymsService()
  
    const { gyms } = await gymService.fetchNerabyGyms({
      userLatitude: latitude,
      userLongitude: longitude,
    })
  
    return reply.status(200).send({
      gyms,
    })
}

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
    })
  
    const { q, page } = searchGymsQuerySchema.parse(request.query)
  
    const gymService = makeSearchGymsService()
  
    const { gyms } = await gymService.searchGyms({
      query: q,
      page,
    })
  
    return reply.status(200).send({
      gyms,
    })
}