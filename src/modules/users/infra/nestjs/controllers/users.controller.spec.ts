import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../../../application/usecases/create-user/create-user.usecase';
import { UsersMapper } from '../../mappers/users.mapper';
import { CreateUserRequestDto } from '../../dto/create-user.request.dto';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserGenderEnum } from '../../../domain/enums/user-gender.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;

  const createUserDto: CreateUserRequestDto = {
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

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateUserUseCase>;

    controller = new UsersController(createUserUseCase);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should map request and return created user response', async () => {
    const mappedInput = {
      name: createUserDto.name,
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      password: createUserDto.password,
      dateOfBirth: createUserDto.dateOfBirth,
      gender: createUserDto.gender,
      phone: createUserDto.phone,
      status: createUserDto.status,
      userType: createUserDto.userType,
    };
    const useCaseOutput = {
      id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      name: createUserDto.name,
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      dateOfBirth: createUserDto.dateOfBirth,
      gender: createUserDto.gender,
      phone: createUserDto.phone,
      status: createUserDto.status,
      userType: createUserDto.userType,
    };

    jest
      .spyOn(UsersMapper, 'mapCreateUserRequestDtoToCreateUserUseCaseInput')
      .mockReturnValue(mappedInput as any);
    createUserUseCase.execute.mockResolvedValue({
      isLeft: () => false,
      value: useCaseOutput,
    } as any);

    const result = await controller.create(createUserDto);

    expect(
      UsersMapper.mapCreateUserRequestDtoToCreateUserUseCaseInput,
    ).toHaveBeenCalledWith(createUserDto);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(mappedInput);
    expect(result).toEqual(useCaseOutput);
  });

  it('should catch and log when use case returns left', async () => {
    const mappedInput = { ...createUserDto };
    const useCaseError = new Error('Email already registered');
    const loggerErrorSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();

    jest
      .spyOn(UsersMapper, 'mapCreateUserRequestDtoToCreateUserUseCaseInput')
      .mockReturnValue(mappedInput as any);
    createUserUseCase.execute.mockResolvedValue({
      isLeft: () => true,
      value: useCaseError,
    } as any);

    const result = await controller.create(createUserDto);

    expect(result).toBeUndefined();
    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('should catch and log when use case throws unexpectedly', async () => {
    const mappedInput = { ...createUserDto };
    const unexpectedError = new Error('Unexpected failure');
    const loggerErrorSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();

    jest
      .spyOn(UsersMapper, 'mapCreateUserRequestDtoToCreateUserUseCaseInput')
      .mockReturnValue(mappedInput as any);
    createUserUseCase.execute.mockRejectedValue(unexpectedError);

    const result = await controller.create(createUserDto);

    expect(result).toBeUndefined();
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error creating user'),
    );
  });
});
