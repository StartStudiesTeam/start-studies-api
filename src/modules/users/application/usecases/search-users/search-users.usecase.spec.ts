import { SearchUsersUseCase } from './search-users.usecase';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { SearchUsersUseCaseInput } from './dto/search-users.input.dto';
import { User } from '../../../domain/user';
import { UserGenderEnum } from '../../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';
import { SearchUsersPersistenceError } from '../../../domain/errors/search-users-persistence-error';

describe('SearchUsersUseCase', () => {
  let useCase: SearchUsersUseCase;
  let userRepository: jest.Mocked<UserRepository>;

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
    },
    'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  ).value as User;

  const secondUser = User.create(
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      nickname: 'janey',
      password: 'secret123',
      dateOfBirth: '1997-11-02',
      gender: UserGenderEnum.FEMALE,
      phone: '+5511888888888',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
    },
    '2fa91349-2c95-4bf4-91f7-d27e97f66c88',
  ).value as User;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findUniqueByEmail: jest.fn(),
      findByNickname: jest.fn(),
      delete: jest.fn(),
      searchByFilters: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new SearchUsersUseCase(userRepository);
  });

  it('should search users successfully', async () => {
    const input = new SearchUsersUseCaseInput({
      filter: 'doe',
      limit: 10,
      offset: 0,
    });

    userRepository.searchByFilters.mockResolvedValue({
      users: [firstUser, secondUser],
      total: 2,
    });

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.total).toBe(2);
      expect(result.value.data).toHaveLength(2);
      expect(result.value.data[0].id).toBe(firstUser.id);
      expect(result.value.data[1].email).toBe(secondUser.email);
    }

    expect(userRepository.searchByFilters).toHaveBeenCalledWith({
      filter: 'doe',
      limit: 10,
      offset: 0,
    });
  });

  it('should return right with empty data when no users are found', async () => {
    const input = new SearchUsersUseCaseInput({
      filter: 'missing',
      limit: 5,
      offset: 0,
    });

    userRepository.searchByFilters.mockResolvedValue({
      users: [],
      total: 0,
    });

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.total).toBe(0);
      expect(result.value.data).toEqual([]);
    }
  });

  it('should apply default pagination values when limit and offset are not provided', async () => {
    const input = new SearchUsersUseCaseInput({
      filter: 'john',
    });

    userRepository.searchByFilters.mockResolvedValue({
      users: [firstUser],
      total: 1,
    });

    await useCase.execute(input);

    expect(userRepository.searchByFilters).toHaveBeenCalledWith({
      filter: 'john',
      limit: 20,
      offset: 0,
    });
  });

  it('should return left with typed persistence error when repository fails', async () => {
    const input = new SearchUsersUseCaseInput({
      filter: 'john',
      limit: 20,
      offset: 0,
    });
    const repositoryError = new Error('Database unavailable');

    userRepository.searchByFilters.mockRejectedValue(repositoryError);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SearchUsersPersistenceError);
      expect(result.value.message).toBe('Failed to search users');
    }
  });

  it('should delegate negative offset to repository without validating in use case', async () => {
    const input = new SearchUsersUseCaseInput({
      filter: 'john',
      limit: 20,
      offset: -1,
    });

    userRepository.searchByFilters.mockResolvedValue({
      users: [firstUser],
      total: 1,
    });

    await useCase.execute(input);

    expect(userRepository.searchByFilters).toHaveBeenCalledWith({
      filter: 'john',
      limit: 20,
      offset: -1,
    });
  });
});
