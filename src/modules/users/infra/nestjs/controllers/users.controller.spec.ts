import { Logger } from '@nestjs/common';
import { left, right } from '@/src/common/errors/either';
import { CreateUserUseCase } from '../../../application/usecases/create-user/create-user.usecase';
import { CreateUserUseCaseInput } from '../../../application/usecases/create-user/dto/create-user.input.dto';
import { CreateUserUseCaseOutput } from '../../../application/usecases/create-user/dto/create-user.output.dto';
import { FetchUserUseCase } from '../../../application/usecases/fetch-user/fetch-user.usecase';
import { FetchUserUseCaseInput } from '../../../application/usecases/fetch-user/dto/fetch-user.input.dto';
import { FetchUserUseCaseOutput } from '../../../application/usecases/fetch-user/dto/fetch-user.output.dto';
import { UserGenderEnum } from '../../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../../domain/enums/user-type.enum';
import { CreateUserRequestDto } from '../../dto/create-user.request.dto';
import { FetchUserRequestDto } from '../../dto/fetch-user.request.dto';
import { UsersMapper } from '../../mappers/users.mapper';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let fetchUserUseCase: jest.Mocked<FetchUserUseCase>;

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

  const fetchUserDto: FetchUserRequestDto = {
    id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  };

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateUserUseCase>;

    fetchUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FetchUserUseCase>;

    controller = new UsersController(createUserUseCase, fetchUserUseCase);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should map request and return created user response', async () => {
    const mappedInput = new CreateUserUseCaseInput({
      name: createUserDto.name,
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      password: createUserDto.password,
      dateOfBirth: createUserDto.dateOfBirth,
      gender: createUserDto.gender,
      phone: createUserDto.phone,
      status: createUserDto.status,
      userType: createUserDto.userType,
    });

    const useCaseOutput = new CreateUserUseCaseOutput({
      id: fetchUserDto.id,
      name: createUserDto.name,
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      dateOfBirth: createUserDto.dateOfBirth,
      gender: createUserDto.gender,
      phone: createUserDto.phone,
      status: createUserDto.status,
      userType: createUserDto.userType,
    });

    jest
      .spyOn(UsersMapper, 'mapCreateUserRequestDtoToCreateUserUseCaseInput')
      .mockReturnValue(mappedInput);
    createUserUseCase.execute.mockResolvedValue(right(useCaseOutput));

    const result = await controller.create(createUserDto);

    expect(
      UsersMapper.mapCreateUserRequestDtoToCreateUserUseCaseInput,
    ).toHaveBeenCalledWith(createUserDto);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(mappedInput);
    expect(result).toEqual(useCaseOutput);
  });

  it('should catch and log when create use case returns left', async () => {
    const mappedInput = new CreateUserUseCaseInput({
      ...createUserDto,
    });
    const useCaseError = new Error('Email already registered');
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    jest
      .spyOn(UsersMapper, 'mapCreateUserRequestDtoToCreateUserUseCaseInput')
      .mockReturnValue(mappedInput);
    createUserUseCase.execute.mockResolvedValue(left(useCaseError));

    const result = await controller.create(createUserDto);

    expect(result).toBeUndefined();
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error creating user'),
    );
  });

  it('should map request and return fetched user response', async () => {
    const mappedInput = new FetchUserUseCaseInput({ id: fetchUserDto.id });
    const useCaseOutput = new FetchUserUseCaseOutput({
      id: fetchUserDto.id,
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johnny',
      dateOfBirth: '1995-04-23',
      gender: UserGenderEnum.MALE,
      phone: '+5511999999999',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
      createdAt: '2026-02-15T10:12:40.000Z',
      updatedAt: '2026-02-15T11:45:10.000Z',
    });

    jest
      .spyOn(UsersMapper, 'mapFetchUserRequestDtoToFetchUserUseCaseInput')
      .mockReturnValue(mappedInput);
    fetchUserUseCase.execute.mockResolvedValue(right(useCaseOutput));

    const result = await controller.fetchById(fetchUserDto);

    expect(
      UsersMapper.mapFetchUserRequestDtoToFetchUserUseCaseInput,
    ).toHaveBeenCalledWith(fetchUserDto);
    expect(fetchUserUseCase.execute).toHaveBeenCalledWith(mappedInput);
    expect(result).toEqual(useCaseOutput);
  });

  it('should throw and log when fetch use case returns left', async () => {
    const mappedInput = new FetchUserUseCaseInput({ id: fetchUserDto.id });
    const useCaseError = new Error('User not found');
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    jest
      .spyOn(UsersMapper, 'mapFetchUserRequestDtoToFetchUserUseCaseInput')
      .mockReturnValue(mappedInput);
    fetchUserUseCase.execute.mockResolvedValue(left(useCaseError));

    await expect(controller.fetchById(fetchUserDto)).rejects.toBe(useCaseError);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching user'),
    );
  });

  it('should wrap non error and throw generic fetch error', async () => {
    const mappedInput = new FetchUserUseCaseInput({ id: fetchUserDto.id });
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    jest
      .spyOn(UsersMapper, 'mapFetchUserRequestDtoToFetchUserUseCaseInput')
      .mockReturnValue(mappedInput);
    fetchUserUseCase.execute.mockRejectedValue('unexpected');

    await expect(controller.fetchById(fetchUserDto)).rejects.toThrow(
      'Failed to fetch user',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching user: Failed to fetch user'),
    );
  });
});
