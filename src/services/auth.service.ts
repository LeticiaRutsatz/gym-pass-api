import { InvalidCredentials } from '@/utils/errors/invalid-credentials';
import { AuthServiceInterface, AuthServiceResponse } from '@/utils/interfaces/auth.interface';
import { UsersRepositoryInterface } from '@/utils/interfaces/usersRepository.interface';
import { compare } from 'bcryptjs';

export class AuthService{
    private usersRepository: UsersRepositoryInterface ;
    
    constructor(usersRepository: UsersRepositoryInterface){
        this.usersRepository = usersRepository
    }

    async execute({email, password} : AuthServiceInterface) : Promise<AuthServiceResponse>{
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentials()
        }

        const doesPasswordMatch = await compare(password, user.password_hash);

        if (!doesPasswordMatch) {
            throw new InvalidCredentials()
        }

        return {
            user,
        }
    }
}