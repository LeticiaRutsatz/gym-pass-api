import { GymsRepositoryInterface, GymsServiceInterface, GymsServiceResponse } from '@/utils/interfaces/gyms.interface';

export class GymService {
    private gymsRepository: GymsRepositoryInterface;

    constructor(gymsRepository: GymsRepositoryInterface){
        this.gymsRepository = gymsRepository
    }

    async execute({
        title, 
        description, 
        phone,
        latitude,
        longitude,
    }: GymsServiceInterface) : Promise<GymsServiceResponse> {

        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        })

        return {
            gym,
        }
    }
}

