import { Module } from '@nestjs/common';
import { UsersController } from './infra/nestjs/controllers/users.controller';
import { CreateUserUseCase } from './application/usecases/create-user/create-user.usecase';
import { DatabaseModule } from '@/src/infra/database/database.module';
import { UserRepository } from './domain/repositories/user-repository';
import { PrismaUserRepository } from '@/src/infra/database/prisma/users/prisma-user.repository';
import { FetchUserUseCase } from './application/usecases/fetch-user/fetch-user.usecase';
import { SearchUsersUseCase } from './application/usecases/search-users/search-users.usecase';
import { UpdateUserUseCase } from './application/usecases/update-user/update-user.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    FetchUserUseCase,
    SearchUsersUseCase,
    UpdateUserUseCase,
  ],
})
export class UsersModule {}
