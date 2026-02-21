import { UsersMapper } from './users.mapper';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { User } from '../../domain/user';
import { UserGenderEnum } from '../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../domain/enums/user-type.enum';
import { CreateUserUseCaseOutput } from '../../application/usecases/create-user/dto/create-user.output.dto';
import { FetchUserRequestDto } from '../dto/fetch-user.request.dto';
import { FetchUserUseCaseOutput } from '../../application/usecases/fetch-user/dto/fetch-user.output.dto';
import { SearchUsersRequestDto } from '../dto/search-users.request.dto';
import {
  SearchUsersOutputItem,
  SearchUsersUseCaseOutput,
} from '../../application/usecases/search-users/dto/search-users.output.dto';
import { PaginatedUsersResult } from '../../domain/types/paginated-users-result.type';

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

  describe('mapSearchUsersRequestDtoToSearchUsersUseCaseInput', () => {
    it('should map request dto to search use case input', () => {
      const dto: SearchUsersRequestDto = {
        filter: 'john',
        limit: 10,
        offset: 5,
      };

      const result =
        UsersMapper.mapSearchUsersRequestDtoToSearchUsersUseCaseInput(dto);

      expect(result).toEqual({
        filter: dto.filter,
        limit: dto.limit,
        offset: dto.offset,
      });
    });
  });

  describe('mapToDomainQuery', () => {
    it('should preserve filter, limit and offset when informed', () => {
      const result = UsersMapper.mapToDomainQuery({
        filter: 'john',
        limit: 15,
        offset: 30,
      });

      expect(result).toEqual({
        filter: 'john',
        limit: 15,
        offset: 30,
      });
    });

    it('should preserve filter and apply default pagination when values are undefined', () => {
      const result = UsersMapper.mapToDomainQuery({
        filter: ' john ',
      });

      expect(result).toEqual({
        filter: ' john ',
        limit: 20,
        offset: 0,
      });
    });
  });

  describe('mapSearchUsersToOutput', () => {
    it('should map repository search result to search use case output', () => {
      const firstUser = User.create(
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

      const secondUser = User.create(
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          nickname: 'janey',
          password: 'secret456',
          status: UserStatusEnum.ACTIVE,
          userType: UserTypeEnum.USER,
          createdAt: new Date('2026-02-14T09:00:00.000Z'),
          updatedAt: new Date('2026-02-14T10:00:00.000Z'),
        },
        '9c4a0866-dc14-4c73-ac40-54de4f0a8b40',
      ).value as User;

      const searchResult: PaginatedUsersResult = {
        users: [firstUser, secondUser],
        total: 2,
      };

      const result = UsersMapper.mapSearchUsersToOutput(searchResult);

      expect(result).toBeInstanceOf(SearchUsersUseCaseOutput);
      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toBeInstanceOf(SearchUsersOutputItem);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: firstUser.id,
          name: firstUser.name,
          email: firstUser.email,
          nickname: firstUser.nickname,
          dateOfBirth: firstUser.dateOfBirth as string,
          gender: firstUser.gender as UserGenderEnum,
          phone: firstUser.phone as string,
          status: firstUser.status as UserStatusEnum,
          userType: firstUser.userType as UserTypeEnum,
          createdAt: firstUser.createdAt,
          updatedAt: firstUser.updatedAt,
        }),
      );
      expect(result.data[1]).toEqual(
        expect.objectContaining({
          id: secondUser.id,
          name: secondUser.name,
          email: secondUser.email,
          nickname: secondUser.nickname,
          status: secondUser.status,
          userType: secondUser.userType,
          createdAt: secondUser.createdAt,
          updatedAt: secondUser.updatedAt,
        }),
      );
      expect(result.data[1]).not.toHaveProperty('dateOfBirth');
      expect(result.data[1]).not.toHaveProperty('gender');
      expect(result.data[1]).not.toHaveProperty('phone');
    });
  });

  describe('mapSearchUsersUseCaseOutputToSearchUsersResponseDto', () => {
    it('should map search use case output to response dto', () => {
      const output = new SearchUsersUseCaseOutput({
        total: 1,
        data: [
          new SearchUsersOutputItem({
            id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
            name: 'John Doe',
            email: 'john@example.com',
            nickname: 'johnny',
            dateOfBirth: '1995-04-23',
            gender: UserGenderEnum.MALE,
            phone: '+5511999999999',
            status: UserStatusEnum.ACTIVE,
            userType: UserTypeEnum.USER,
            createdAt: new Date('2026-02-15T10:12:40.000Z'),
            updatedAt: new Date('2026-02-15T11:45:10.000Z'),
          }),
        ],
      });

      const result =
        UsersMapper.mapSearchUsersUseCaseOutputToSearchUsersResponseDto(output);

      expect(result).toEqual({
        total: 1,
        data: [
          {
            id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
            name: 'John Doe',
            email: 'john@example.com',
            nickname: 'johnny',
            dateOfBirth: '1995-04-23',
            gender: UserGenderEnum.MALE,
            phone: '+5511999999999',
            status: UserStatusEnum.ACTIVE,
            userType: UserTypeEnum.USER,
            createdAt: new Date('2026-02-15T10:12:40.000Z'),
            updatedAt: new Date('2026-02-15T11:45:10.000Z'),
          },
        ],
      });
    });
  });
});
