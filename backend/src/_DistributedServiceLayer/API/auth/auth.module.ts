import { Module } from '@nestjs/common';
import { ClassProvider } from '@nestjs/common/interfaces';
import { AuthService } from '_ApplicationLayer/Services/auth.service';
import { AUTH_REPOSITORY } from '_Common/Constant/RepositoryNames/Repositories';
import { AUTH_SERVICE } from '_Common/Constant/ServiceNames/Services';
import { AuthRepository } from '_InfrastructureLayer/Repositories/DynamoDB/Auth/auth.repository';
import { AuthController } from './auth.controller';

const authRepositoryProvider: ClassProvider = {
  provide: AUTH_REPOSITORY,
  useClass: AuthRepository,
};

const authServiceProvider: ClassProvider = {
  provide: AUTH_SERVICE,
  useClass: AuthService,
};

@Module({
  //imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [authRepositoryProvider, authServiceProvider],
  exports: [authServiceProvider],
})
export class AuthModule {}
