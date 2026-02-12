import { Injectable } from '@nestjs/common';
import {
  CreateUserRepositoryInput,
  UserRepository,
} from '@/src/modules/users/domain/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { User } from '@/src/modules/users/domain/user';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { nickname },
    });
  }

  async create(input: CreateUserRepositoryInput): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        nickname: input.nickname,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        phone: input.phone,
        status: input.status,
        userType: input.userType,
      },
    });

    return createdUser;
  }
}
