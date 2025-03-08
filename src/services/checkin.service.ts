import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFound } from '@/utils/errors/resource-not-found.error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates';
import { CheckInRepositoryInterface, CheckInServiceInterface, CheckInServiceResponse } from '@/utils/interfaces/checkin.interface';
import { GymsRepositoryInterface } from '@/utils/interfaces/gyms.interface';

export class CheckInService{
    private checkInRepository: CheckInRepositoryInterface;
    private gymsRepository: GymsRepositoryInterface;
    
    constructor(checkInRepository: CheckInRepositoryInterface, gymsRepository: GymsRepositoryInterface){
        this.checkInRepository = checkInRepository,
        this.gymsRepository = gymsRepository
    }

    async execute({userId, gymId, userLatitude, userLongitude} : CheckInServiceInterface) : Promise<CheckInServiceResponse>{
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFound()
        }

        // calculate distance between user and gym
        const distance = getDistanceBetweenCoordinates(
            {latitude: userLatitude, longitude: userLongitude},
            {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()},
        )

        const maxDistance = 0.1;
        if(distance > maxDistance){
            throw new Error('Distance too far')
        }
        
        const checkInOnSameDay = await this.checkInRepository.findByUserIdAndDate(
            userId,
            new Date(),
        )
      
        if (checkInOnSameDay) {
        throw new Error()
        }

        const checkIn = await this.checkInRepository.create({
            user_id: userId, 
            gym_id: gymId
        });

        return {
            checkIn,
        }
    }
}