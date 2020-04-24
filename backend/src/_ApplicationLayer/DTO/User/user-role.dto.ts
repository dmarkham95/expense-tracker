import { IsString } from 'class-validator';

export class SystemRoleDto {

  @IsString()
  public Name: string;

}
