import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '@/src/modules/users/domain/user';

export class PrismaUserMapper {
  static toEntity(raw: PrismaUser): User {
    const userOrError = User.create(
      {
        name: raw.name,
        email: raw.email,
        nickname: raw.nickname,
        password: raw.password,
        dateOfBirth: raw.dateOfBirth,
        gender: raw.gender,
        phone: raw.phone,
        status: raw.status,
        userType: raw.userType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      raw.id,
    );

    if (userOrError.isLeft()) {
      throw userOrError.value;
    }

    return userOrError.value;
  }

  static toPrisma(entity: User): Prisma.UserUncheckedCreateInput {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      nickname: entity.nickname,
      dateOfBirth: entity.dateOfBirth,
      gender: entity.gender,
      phone: entity.phone,
      status: entity.status ?? 'active',
      userType: entity.userType,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntityList(rawUsers: PrismaUser[]): User[] {
    return rawUsers.map((rawUser) => PrismaUserMapper.toEntity(rawUser));
  }
}
