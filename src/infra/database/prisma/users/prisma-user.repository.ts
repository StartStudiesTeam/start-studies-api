import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/src/modules/users/domain/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { User } from '@/src/modules/users/domain/user';
import { PrismaUserMapper } from './mapper/prisma-user.mapper';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!user) return null;

    return PrismaUserMapper.toEntity(user);
  }

  async findUniqueByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return PrismaUserMapper.toEntity(user);
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: { nickname },
    });

    if (!user) return null;

    return PrismaUserMapper.toEntity(user);
  }

  async create(input: User): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: PrismaUserMapper.toPrisma(input),
    });

    return PrismaUserMapper.toEntity(createdUser);
  }
}
