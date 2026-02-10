import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../infra/dto/create-user.dto';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
}
