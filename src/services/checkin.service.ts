import { LateCheckInValidationError } from '@/utils/errors/late-check-in-validation.error';
import { MaxDistanceError } from '@/utils/errors/max-distance.error';
import { MaxNumberOfCheckInsError } from '@/utils/errors/max-numbers-of-check-ins.error';
import { ResourceNotFound } from '@/utils/errors/resource-not-found.error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates';
import { CheckInRepositoryInterface, CheckInServiceHistoryInterface, CheckInServiceHistoryResponse, CheckInServiceInterface, CheckInServiceNumberInterface, CheckInServiceNumberResponse, CheckInServiceResponse, CheckInServiceValidateRequest, CheckInServiceValidateResponse } from '@/utils/interfaces/checkin.interface';
import { GymsRepositoryInterface } from '@/utils/interfaces/gyms.interface';
import dayjs from 'dayjs';

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
        console.log("distance: " + distance)

        const maxDistance = 0.1;
        if(distance > maxDistance){
            throw new MaxDistanceError()
        }
        
        const checkInOnSameDay = await this.checkInRepository.findByUserIdAndDate(
            userId,
            new Date(),
        )
      
        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckInsError()
        }

        const checkIn = await this.checkInRepository.create({
            user_id: userId, 
            gym_id: gymId
        });

        return {
            checkIn,
        }
    }

    async searchCheckInHistory({userId, page} : CheckInServiceHistoryInterface) : Promise<CheckInServiceHistoryResponse>{
        const checkIns = await this.checkInRepository.findManyByUserId(
            userId,
            page,
        )
      
        return {
            checkIns,
        }
    }

    async getNumberOfCheckings({userId}: CheckInServiceNumberInterface): Promise<CheckInServiceNumberResponse> {
        const checkInsCount = await this.checkInRepository.countByUserId(userId)
    
        return {
          checkInsCount,
        }
    }

    async validateCheckIn({checkInId} : CheckInServiceValidateRequest): Promise<CheckInServiceValidateResponse>{
        const checkIn = await this.checkInRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourceNotFound()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes',
        )
      
        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInRepository.save(checkIn)

        return {
            checkIn,
        }
    }
}