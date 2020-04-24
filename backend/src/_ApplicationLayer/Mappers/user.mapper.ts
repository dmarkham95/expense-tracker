import { UserDto } from "_ApplicationLayer/DTO/User/user.dto";
import { DDBUser } from "_DomainLayer/Entities/DynamoDB/user.ddb";
import { IMapper } from "_DomainLayer/Services/IMapper ";


class UserMapper implements IMapper<DDBUser,UserDto> {
    
    toDomain(dto: UserDto): DDBUser {
        throw new Error("Method not implemented.");
    }    
    
    toDTO(t: DDBUser) {

        let dto: UserDto = {
            userId: t.UserId,
            firstName: t.FirstName,
            lastName: t.LastName,
            email: t.Email,
            isActive: t.IsActive,
            isConfirmed: t.IsConfirmed,
            fullName: t.FullName ? t.FullName :  `${t.LastName}, ${t.FirstName}`,
            roles: t.Roles,
        }
        
        return dto;
    }

    toMinDTO(t: DDBUser) {

        let dto: UserDto = {
            userId: t.UserId,
            fullName: t.FullName ? t.FullName :  `${t.LastName}, ${t.FirstName}`,
        }
        
        return dto;
    }

}

const instance = new UserMapper();

export default instance;