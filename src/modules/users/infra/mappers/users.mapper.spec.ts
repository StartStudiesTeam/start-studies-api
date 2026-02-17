import { UsersMapper } from './users.mapper';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { User } from '../../domain/user';
import { UserGenderEnum } from '../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../domain/enums/user-type.enum';
import { CreateUserUseCaseOutput } from '../../application/usecases/create-user/dto/create-user.output.dto';
import { FetchUserRequestDto } from '../dto/fetch-user.request.dto';
import { FetchUserUseCaseOutput } from '../../application/usecases/fetch-user/dto/fetch-user.output.dto';

describe('UsersMapper', () => {
  describe('mapCreateUserRequestDtoToCreateUserUseCaseInput', () => {
    it('should map request dto to use case input', () => {
      const dto: CreateUserRequestDto = {
        name: 'John Doe',
        email: 'john@example.com',
        nickname: 'johnny',
        password: 'secret123',
        dateOfBirth: '1995-04-23',
        gender: UserGenderEnum.MALE,
        phone: '+5511999999999',
        status: UserStatusEnum.ACTIVE,
        userType: UserTypeEnum.USER,
      };

      const result =
        UsersMapper.mapCreateUserRequestDtoToCreateUserUseCaseInput(dto);

      expect(result).toEqual({
        name: dto.name,
        email: dto.email,
        nickname: dto.nickname,
        password: dto.password,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        status: dto.status,
        userType: dto.userType,
      });
    });
  });

  describe('mapUserToCreateUserUseCaseOutput', () => {
    it('should map persisted user to use case output with all optional fields', () => {
      const user = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          dateOfBirth: '1995-04-23',
          gender: UserGenderEnum.MALE,
          phone: '+5511999999999',
          status: UserStatusEnum.ACTIVE,
          userType: UserTypeEnum.USER,
        },
        'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      ).value as User;

      const result = UsersMapper.mapUserToCreateUserUseCaseOutput(user);

      expect(result).toBeInstanceOf(CreateUserUseCaseOutput);
      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.nickname,
          dateOfBirth: user.dateOfBirth as string,
          gender: user.gender as UserGenderEnum,
          phone: user.phone as string,
          status: user.status as UserStatusEnum,
          userType: user.userType as UserTypeEnum,
        }),
      );
    });

    it('should apply active status when user status is undefined', () => {
      const user = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          userType: UserTypeEnum.USER,
        },
        'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      ).value as User;

      const result = UsersMapper.mapUserToCreateUserUseCaseOutput(user);

      expect(result.status).toBe(UserStatusEnum.ACTIVE);
      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.nickname,
          userType: user.userType,
        }),
      );
      expect(result).not.toHaveProperty('dateOfBirth');
      expect(result).not.toHaveProperty('gender');
      expect(result).not.toHaveProperty('phone');
    });
  });

  describe('mapFetchUserRequestDtoToFetchUserUseCaseInput', () => {
    it('should map request dto to fetch use case input', () => {
      const dto: FetchUserRequestDto = {
        id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      };

      const result =
        UsersMapper.mapFetchUserRequestDtoToFetchUserUseCaseInput(dto);

      expect(result).toEqual({
        id: dto.id,
      });
    });
  });

  describe('mapUserToFetchUserUseCaseOutput', () => {
    it('should map persisted user to fetch output with all optional fields', () => {
      const user = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          dateOfBirth: '1995-04-23',
          gender: UserGenderEnum.MALE,
          phone: '+5511999999999',
          status: UserStatusEnum.ACTIVE,
          userType: UserTypeEnum.USER,
          createdAt: new Date('2026-02-15T10:12:40.000Z'),
          updatedAt: new Date('2026-02-15T11:45:10.000Z'),
        },
        'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      ).value as User;

      const result = UsersMapper.mapUserToFetchUserUseCaseOutput(user);

      expect(result).toBeInstanceOf(FetchUserUseCaseOutput);
      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.nickname,
          dateOfBirth: user.dateOfBirth as string,
          gender: user.gender as UserGenderEnum,
          phone: user.phone as string,
          status: user.status as UserStatusEnum,
          userType: user.userType as UserTypeEnum,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
      );
    });

    it('should omit optional fields when user has null optionals', () => {
      const user = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          status: UserStatusEnum.ACTIVE,
          userType: UserTypeEnum.USER,
          createdAt: new Date('2026-02-15T10:12:40.000Z'),
          updatedAt: new Date('2026-02-15T11:45:10.000Z'),
        },
        'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      ).value as User;

      const result = UsersMapper.mapUserToFetchUserUseCaseOutput(user);

      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.nickname,
          status: user.status,
          userType: user.userType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
      );
      expect(result).not.toHaveProperty('dateOfBirth');
      expect(result).not.toHaveProperty('gender');
      expect(result).not.toHaveProperty('phone');
    });
  });
});
