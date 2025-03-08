import { GymsRepositoryInterface, GymsServiceInterface, GymsServiceResponse, GymsServiceSearchInterface, GymsServiceSearchResponse } from '@/utils/interfaces/gyms.interface';

export class GymService {
    private gymsRepository: GymsRepositoryInterface;

    constructor(gymsRepository: GymsRepositoryInterface){
        this.gymsRepository = gymsRepository
    }

    async createGym({
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

    async searchGyms({
        query,
        page,
      }: GymsServiceSearchInterface): Promise<GymsServiceSearchResponse> {
        const gyms = await this.gymsRepository.searchMany(query, page)
    
        return {
          gyms,
        }
    }
}

