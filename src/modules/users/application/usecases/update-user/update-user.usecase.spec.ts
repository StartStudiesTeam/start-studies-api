import { UpdateUserUseCase } from './update-user.usecase';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/user';
import { UserGenderEnum } from '../../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';
import { UpdateUserUseCaseInput } from './dto/update-user.input.dto';
import { UserNotFoundError } from '../../../domain/errors/user-not-found-error';
import { UpdateUserPersistenceError } from '../../../domain/errors/update-user-persistence-error';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const userId = 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa';

  const existingUser = User.create(
    {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johnny',
      password: 'secret123',
      gender: UserGenderEnum.MALE,
      phone: '+5511999999999',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
    },
    userId,
  ).value as User;

  const updatedUser = User.create(
    {
      name: 'John New',
      email: 'john.new@example.com',
      nickname: 'johnnynew',
      password: 'secret123',
      gender: UserGenderEnum.MALE,
      phone: '+5511888888888',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
    },
    userId,
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

    useCase = new UpdateUserUseCase(userRepository);
  });

  it('should update a user successfully', async () => {
    const input = new UpdateUserUseCaseInput({
      id: userId,
      name: 'John New',
      email: 'john.new@example.com',
      nickname: 'johnnynew',
      phone: '+5511888888888',
    });

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBe(userId);
      expect(result.value.name).toBe('John New');
      expect(result.value.email).toBe('john.new@example.com');
      expect(result.value.nickname).toBe('johnnynew');
      expect(result.value.phone).toBe('+5511888888888');
    }

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should return left when user does not exist', async () => {
    const input = new UpdateUserUseCaseInput({
      id: userId,
      name: 'John New',
    });

    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
      expect(result.value.message).toBe('User not found');
    }
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('should return left with update persistence error when repository fails', async () => {
    const input = new UpdateUserUseCaseInput({
      id: userId,
      name: 'John New',
    });

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.update.mockRejectedValue(new Error('Database unavailable'));

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UpdateUserPersistenceError);
      expect(result.value.message).toBe('Failed to update user');
    }
  });
});
