import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/src/modules/users/domain/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { User } from '@/src/modules/users/domain/user';
import { PrismaUserMapper } from './mapper/prisma-user.mapper';
import { SearchQuery } from '@/src/common/types/pagination/search-users-query.type';
import { PaginatedUsersResult } from '@/src/modules/users/domain/types/paginated-users-result.type';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
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

  async searchByFilters(query: SearchQuery): Promise<PaginatedUsersResult> {
    const normalizedFilter = query.filter?.trim();
    const where = normalizedFilter
      ? {
          OR: [
            {
              name: {
                contains: normalizedFilter,
                mode: 'insensitive' as const,
              },
            },
            {
              nickname: {
                contains: normalizedFilter,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : undefined;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        take: query.limit,
        skip: query.offset,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      users: PrismaUserMapper.toEntityList(users),
      total,
    };
  }

  async update(input: User): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: input.id,
      },
      data: PrismaUserMapper.toPrisma(input),
    });

    return PrismaUserMapper.toEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: UserStatusEnum.INACTIVE,
      },
    });
  }
}
