import { ResourceNotFound } from '@/utils/errors/resource-not-found.error';
import { GetUserProfileServiceInterface, GetUserProfileServiceResponse } from '@/utils/interfaces/get-user-profile.interface';
import { UsersRepositoryInterface } from '@/utils/interfaces/usersRepository.interface';

export class GetUserProfileService{
    private usersRepository: UsersRepositoryInterface ;
    
        constructor(usersRepository: UsersRepositoryInterface){
            this.usersRepository = usersRepository
        }
    
        async execute({
            userId, 
        }: GetUserProfileServiceInterface) : Promise<GetUserProfileServiceResponse> {
    
            const user = await this.usersRepository.findById(userId);
    
            if (!user) {
                throw new ResourceNotFound()
            }
    
            return {
                user,
            }
        }
}