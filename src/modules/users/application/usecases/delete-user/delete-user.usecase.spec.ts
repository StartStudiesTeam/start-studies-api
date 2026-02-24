import { DeleteUserUseCase } from './delete-user.usecase';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { DeleteUserUseCaseInput } from './dto/delete-user.input.dto';
import { UserNotFoundError } from '../../../domain/errors/user-not-found-error';
import { UserNotAvailableError } from '../../../domain/errors/user-not-available-error';
import { User } from '../../../domain/user';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const input = new DeleteUserUseCaseInput({
    id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  });

  const existingUser = User.create(
    {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johnny',
      password: 'secret123',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
    },
    input.id,
  ).value as User;

  const deletedUser = User.create(
    {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johnny',
      password: 'secret123',
      status: UserStatusEnum.INACTIVE,
      userType: UserTypeEnum.USER,
      deletedAt: new Date('2026-02-20T00:00:00.000Z'),
    },
    input.id,
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

    useCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete user successfully', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.delete.mockResolvedValue(undefined);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeUndefined();
    }
    expect(userRepository.findById).toHaveBeenCalledWith(input.id);
    expect(userRepository.delete).toHaveBeenCalledWith(input.id);
  });

  it('should return left when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
      expect(result.value.message).toBe('User not found');
    }
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('should return left with repository error', async () => {
    const repositoryError = new Error('Database unavailable');
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.delete.mockRejectedValue(repositoryError);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe(repositoryError);
    }
  });

  it('should return left when user is already deleted', async () => {
    userRepository.findById.mockResolvedValue(deletedUser);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotAvailableError);
      expect(result.value.message).toBe('User already deleted');
    }
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
