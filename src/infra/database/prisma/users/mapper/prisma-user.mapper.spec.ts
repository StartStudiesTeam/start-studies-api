import { User as PrismaUser } from '@prisma/client';
import { PrismaUserMapper } from './prisma-user.mapper';
import { User } from '@/src/modules/users/domain/user';

describe('PrismaUserMapper', () => {
  const makeRawUser = (overrides?: Partial<PrismaUser>): PrismaUser => ({
    id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123',
    nickname: 'johnny',
    dateOfBirth: '1995-04-23',
    gender: 'male',
    phone: '+5511999999999',
    status: 'active',
    userType: 'user',
    createdAt: new Date('2026-02-15T10:12:40.000Z'),
    updatedAt: new Date('2026-02-15T11:45:10.000Z'),
    ...overrides,
  });

  describe('toEntity', () => {
    it('should map prisma model to domain entity', () => {
      const raw = makeRawUser();

      const result = PrismaUserMapper.toEntity(raw);

      expect(result).toBeInstanceOf(User);
      expect(result).toEqual(
        expect.objectContaining({
          id: raw.id,
          name: raw.name,
          email: raw.email,
          password: raw.password,
          nickname: raw.nickname,
          dateOfBirth: raw.dateOfBirth,
          gender: raw.gender,
          phone: raw.phone,
          status: raw.status,
          userType: raw.userType,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        }),
      );
    });

    it('should throw when raw user data is invalid', () => {
      const raw = makeRawUser({ name: 'abc' });

      expect(() => PrismaUserMapper.toEntity(raw)).toThrow(
        'O nome deve ter no mínimo 4 caracteres.',
      );
    });
  });

  describe('toPrisma', () => {
    it('should map domain entity to prisma create input', () => {
      const entity = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          dateOfBirth: '1995-04-23',
          gender: 'male',
          phone: '+5511999999999',
          status: 'active',
          userType: 'user',
          createdAt: new Date('2026-02-15T10:12:40.000Z'),
          updatedAt: new Date('2026-02-15T11:45:10.000Z'),
        },
        'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      ).value as User;

      const result = PrismaUserMapper.toPrisma(entity);

      expect(result).toEqual({
        name: entity.name,
        email: entity.email,
        password: entity.password,
        nickname: entity.nickname,
        dateOfBirth: entity.dateOfBirth,
        gender: entity.gender,
        phone: entity.phone,
        status: entity.status,
        userType: entity.userType,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      });
    });

    it('should default status to active when entity status is null', () => {
      const entity = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          userType: 'user',
        },
        'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      ).value as User;

      const result = PrismaUserMapper.toPrisma(entity);

      expect(result.status).toBe('active');
    });
  });

  describe('toEntityList', () => {
    it('should map a list of prisma users to domain entities', () => {
      const rawUsers = [
        makeRawUser(),
        makeRawUser({
          id: '9c4a0866-dc14-4c73-ac40-54de4f0a8b40',
          email: 'jane@example.com',
          nickname: 'janey',
          name: 'Jane Doe',
        }),
      ];

      const result = PrismaUserMapper.toEntityList(rawUsers);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(result[0].id).toBe(rawUsers[0].id);
      expect(result[1].id).toBe(rawUsers[1].id);
    });
  });
});
