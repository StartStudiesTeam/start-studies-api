import { Module } from '@nestjs/common';
import { UsersController } from './infra/nestjs/controllers/users.controller';
import { UsersService } from './application/services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
