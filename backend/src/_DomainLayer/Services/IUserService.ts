import { AuthUserDto } from "_ApplicationLayer/DTO/Auth";
import { UserDto } from "_ApplicationLayer/DTO/User/user.dto";

export interface IUserService {
  findAll(accountId: string,activeOnly: boolean): Promise<UserDto[]>;
  findUserById(id: string): Promise<UserDto | undefined>;
}
