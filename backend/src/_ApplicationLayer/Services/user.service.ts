import { Inject, Injectable } from '@nestjs/common';
import { AuthUserDto } from '_ApplicationLayer/DTO/Auth';
import { UserDto } from '_ApplicationLayer/DTO/User/user.dto';
import { UserMapper } from '_ApplicationLayer/Mappers';
import { IUserService } from '_DomainLayer/Services/IUserService';
import { IUserDDBRepository } from '_DomainLayer/Repositories/DynamoDB/IUserRepository';

@Injectable()
export class UserService implements IUserService {
   

    private userRepository: IUserDDBRepository;

    constructor(@Inject('DDBUserRepository') userRepository: IUserDDBRepository) {
      this.userRepository = userRepository;
    }

    public async findAll(accountId: string,activeOnly = true): Promise<UserDto[]> {
        const users = await this.userRepository.getAll(accountId);
        const userList = users.map(u => UserMapper.toMinDTO(u));
        return userList;
    }

    public async findUserById(id: string): Promise<UserDto> {
       const user = await this.userRepository.getUserById(id);
       const userDto = UserMapper.toDTO(user);
    return userDto;
    }


}
