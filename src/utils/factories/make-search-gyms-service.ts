import { GymsRepository } from '@/repositories/gyms-repository'
import { GymService } from '@/services/gym.service'

export function makeSearchGymsUseCase() {
  const gymsRepository = new GymsRepository();
  const service = new GymService(gymsRepository);

  return service
}