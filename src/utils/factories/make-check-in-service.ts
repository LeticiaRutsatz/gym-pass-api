
import { CheckInService } from '@/services/checkin.service'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckInRepository } from '@/repositories/check-ins-repository'

export function makeValidateCheckService() {
  const checkInsRepository = new CheckInRepository();
  const gymRepository = new GymsRepository();

  const service = new CheckInService(checkInsRepository, gymRepository);

  return service
}