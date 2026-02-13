import { CreateUserUseCase } from './create-user.usecase';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/user';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';
import { UserGenderEnum } from '../../../domain/enums/user-gender.enum';
import { CreateUserUseCaseInput } from './dto/create-user.input.dto';
import { EmailAlreadyExistsError } from '../../../domain/errors/email-already-exists-error';
import { NicknameAlreadyExistsError } from '../../../domain/errors/nickaname-already-exists-error';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const input: CreateUserUseCaseInput = {
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

  const persistedUser = User.create(
    {
      ...input,
    },
    'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  ).value as User;

  beforeEach(() => {
    userRepository = {
      findUniqueByEmail: jest.fn(),
      findByNickname: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new CreateUserUseCase(userRepository);
  });

  it('should create a user successfully', async () => {
    userRepository.findUniqueByEmail.mockResolvedValue(null);
    userRepository.findByNickname.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(persistedUser);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBe(persistedUser.id);
      expect(result.value.email).toBe(persistedUser.email);
      expect(result.value.nickname).toBe(persistedUser.nickname);
      expect(result.value.status).toBe(UserStatusEnum.ACTIVE);
    }
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        email: input.email,
        nickname: input.nickname,
        password: input.password,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        phone: input.phone,
        status: input.status,
        userType: input.userType,
      }),
    );
  });

  it('should return left when email is already registered', async () => {
    userRepository.findUniqueByEmail.mockResolvedValue(persistedUser);
    userRepository.findByNickname.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyExistsError);
      expect(result.value.message).toBe(
        'A user with this email already exists',
      );
    }
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should return left when nickname is already registered', async () => {
    userRepository.findUniqueByEmail.mockResolvedValue(null);
    userRepository.findByNickname.mockResolvedValue(persistedUser);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NicknameAlreadyExistsError);
      expect(result.value.message).toBe(
        'A user with this nickname already exists',
      );
    }
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should return left with repository error', async () => {
    const repositoryError = new Error('Database unavailable');
    userRepository.findUniqueByEmail.mockRejectedValue(repositoryError);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe(repositoryError);
    }
  });
});
