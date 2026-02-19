import { FetchUserUseCase } from './fetch-user.usecase';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/user';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';
import { UserGenderEnum } from '../../../domain/enums/user-gender.enum';
import { FetchUserUseCaseInput } from './dto/fetch-user.input.dto';
import { UserNotFoundError } from '../../../domain/errors/user-not-found-error';

describe('FetchUserUseCase', () => {
  let useCase: FetchUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const input = new FetchUserUseCaseInput({
    id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  });

  const persistedUser = User.create(
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
    input.id,
  ).value as User;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findUniqueByEmail: jest.fn(),
      findByNickname: jest.fn(),
      searchByFilters: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new FetchUserUseCase(userRepository);
  });

  it('should fetch a user successfully', async () => {
    userRepository.findById.mockResolvedValue(persistedUser);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBe(persistedUser.id);
      expect(result.value.email).toBe(persistedUser.email);
      expect(result.value.nickname).toBe(persistedUser.nickname);
      expect(result.value.status).toBe(persistedUser.status);
    }
    expect(userRepository.findById).toHaveBeenCalledWith(input.id);
  });

  it('should return left when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
      expect(result.value.message).toBe('User not found');
    }
    expect(userRepository.findById).toHaveBeenCalledWith(input.id);
  });

  it('should return left with repository error', async () => {
    const repositoryError = new Error('Database unavailable');
    userRepository.findById.mockRejectedValue(repositoryError);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe(repositoryError);
    }
  });
});
