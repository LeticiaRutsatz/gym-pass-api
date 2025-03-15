import { makeValidateCheckService } from '@/utils/factories/make-check-in-service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply){
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => {
          return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
          return Math.abs(value) <= 180
        }),
    })
    
    const { gymId } = createCheckInParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const checkInService = makeValidateCheckService()

    await checkInService.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude,
    })
    
    return reply.status(201).send()
}

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
    })
  
    const { page } = checkInHistoryQuerySchema.parse(request.query)
  
    const checkInService = makeValidateCheckService()
  
    const { checkIns } = await checkInService.searchCheckInHistory({
      page,
      userId: request.user.sub,
    })
  
    return reply.status(200).send({
      checkIns,
    })
}

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
    const checkInService = makeValidateCheckService()
  
    const { checkInsCount } = await checkInService.getNumberOfCheckings({
      userId: request.user.sub,
    })
  
    return reply.status(200).send({
      checkInsCount,
    })
}

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    })
  
    const { checkInId } = validateCheckInParamsSchema.parse(request.params)
  
    const checkInService = makeValidateCheckService()
  
    await checkInService.validateCheckIn({
      checkInId,
    })
  
    return reply.status(204).send()
}