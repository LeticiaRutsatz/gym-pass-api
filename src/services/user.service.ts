import { RegisterServiceInterface, RegisterServiceResponse } from '@/utils/interfaces/register.interface';
import { UsersRepositoryInterface } from '@/utils/interfaces/usersRepository.interface';
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists.error';
import { hash } from 'bcryptjs';
import { GetUserProfileServiceInterface, GetUserProfileServiceResponse } from '@/utils/interfaces/get-user-profile.interface';
import { ResourceNotFound } from '@/utils/errors/resource-not-found.error';

// Dependencie Inversion
// In this code, Dependency Inversion is implemented by allowing the 
// `RegisterUseCase` class to receive a `usersRepository` as a dependency
// through its constructor. This means that `RegisterUseCase` does not 
// directly instantiate or depend on the `PrismaUsersRepository` or any 
// other specific implementation of the user repository. Instead, it relies 
// on an abstraction (`usersRepository`), which could be any repository 
// implementation that conforms to the expected contract

export class UserService {
    private usersRepository: UsersRepositoryInterface ;

    constructor(usersRepository: UsersRepositoryInterface){
        this.usersRepository = usersRepository
    }

    async createUser({
        name, 
        email, 
        password 
    }: RegisterServiceInterface) : Promise<RegisterServiceResponse> {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        })

        return {
            user,
        }
    }

    async getUserProfile({userId}: GetUserProfileServiceInterface) : Promise<GetUserProfileServiceResponse> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFound()
        }

        return {
            user,
        }
    }
}

