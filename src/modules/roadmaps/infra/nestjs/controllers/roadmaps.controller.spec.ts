import { Logger } from '@nestjs/common';
import { left, right } from '@/src/common/errors/either';
import { CreateRoadmapUseCase } from '../../../application/usecases/create-roadmap/create-roadmap.usecase';
import { CreateRoadmapUseCaseInput } from '../../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { FetchRoadmapUseCase } from '../../../application/usecases/fetch-roadmap/fetch-roadmap.usecase';
import { FetchRoadmapUseCaseInput } from '../../../application/usecases/fetch-roadmap/dto/fetch-roadmap.input.dto';
import { FetchRoadmapUseCaseOutput } from '../../../application/usecases/fetch-roadmap/dto/fetch-roadmap.output.dto';
import { RoadmapStatusEnum } from '../../../domain/enums/roadmap-status.enum';
import { RoadmapCreationUserNotFoundError } from '../../../domain/errors/roadmap-creation-user-not-found-error';
import { RoadmapNotFoundError } from '../../../domain/errors/roadmap-not-found-error';
import { CreateRoadmapRequestDto } from '../../dto/create-roadmap.request.dto';
import { FetchRoadmapRequestDto } from '../../dto/fetch-roadmap.request.dto';
import { FetchRoadmapResponseDto } from '../../dto/fetch-roadmap.response.dto';
import { RoadmapsMapper } from '../../mappers/roadmaps.mapper';
import { RoadmapsController } from './roadmaps.controller';
import { CreateRoadmapResponseDto } from '../../dto/create-roadmap.response.dto';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';

describe('RoadmapsController', () => {
  let controller: RoadmapsController;
  let createRoadmapUseCase: jest.Mocked<CreateRoadmapUseCase>;
  let fetchRoadmapUseCase: jest.Mocked<FetchRoadmapUseCase>;

  const createRoadmapDto: CreateRoadmapRequestDto = {
    title: 'Roadmap Backend',
    description: 'Plano de estudo para evoluir em backend com NestJS.',
    userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
    status: RoadmapStatusEnum.DRAFT,
  };

  const fetchRoadmapDto: FetchRoadmapRequestDto = {
    id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
  };

  beforeEach(() => {
    createRoadmapUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateRoadmapUseCase>;

    fetchRoadmapUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FetchRoadmapUseCase>;

    controller = new RoadmapsController(
      createRoadmapUseCase,
      fetchRoadmapUseCase,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should map request and return created roadmap response', async () => {
    const mappedInput = new CreateRoadmapUseCaseInput({
      ...createRoadmapDto,
    });

    const useCaseOutput = new CreateRoadmapUseCaseOutput({
      id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
      ...createRoadmapDto,
    });

    const mappedResponse: CreateRoadmapResponseDto = {
      id: useCaseOutput.id,
      title: useCaseOutput.title,
      description: useCaseOutput.description,
      userId: useCaseOutput.userId,
      status: useCaseOutput.status,
    };

    jest
      .spyOn(RoadmapsMapper, 'mapCreateRoadmapRequestDtoToCreateRoadmapUseCaseInput')
      .mockReturnValue(mappedInput);
    jest
      .spyOn(
        RoadmapsMapper,
        'mapCreateRoadmapUseCaseOutputToCreateRoadmapResponseDto',
      )
      .mockReturnValue(mappedResponse);
    createRoadmapUseCase.execute.mockResolvedValue(right(useCaseOutput));

    const result = await controller.create(createRoadmapDto);

    expect(
      RoadmapsMapper.mapCreateRoadmapRequestDtoToCreateRoadmapUseCaseInput,
    ).toHaveBeenCalledWith(createRoadmapDto);
    expect(createRoadmapUseCase.execute).toHaveBeenCalledWith(mappedInput);
    expect(
      RoadmapsMapper.mapCreateRoadmapUseCaseOutputToCreateRoadmapResponseDto,
    ).toHaveBeenCalledWith(useCaseOutput);
    expect(result).toEqual(mappedResponse);
  });

  it('should throw and log when create use case returns left', async () => {
    const useCaseError = new RoadmapCreationUserNotFoundError();
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    createRoadmapUseCase.execute.mockResolvedValue(left(useCaseError));

    await expect(controller.create(createRoadmapDto)).rejects.toBe(useCaseError);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error creating roadmap'),
    );
  });

  it('should wrap non error and throw generic create roadmap error', async () => {
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    createRoadmapUseCase.execute.mockRejectedValue('unexpected');

    await expect(controller.create(createRoadmapDto)).rejects.toThrow(
      'Failed to create roadmap',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error creating roadmap: Failed to create roadmap'),
    );
  });

  it('should map request and return fetched roadmap response', async () => {
    const mappedInput = new FetchRoadmapUseCaseInput({
      id: fetchRoadmapDto.id,
    });

    const useCaseOutput = new FetchRoadmapUseCaseOutput({
      id: fetchRoadmapDto.id,
      title: 'Roadmap Backend',
      description: 'Plano de estudo para evoluir em backend com NestJS.',
      userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      status: RoadmapStatusEnum.DRAFT,
      createdAt: '2026-02-15T10:12:40.000Z',
      updatedAt: '2026-02-15T11:45:10.000Z',
      user: {
        name: 'Ruan Brito',
        nickname: 'ruanzinho',
        status: UserStatusEnum.ACTIVE,
        userType: UserTypeEnum.USER,
      },
    });

    const mappedResponse: FetchRoadmapResponseDto = {
      id: useCaseOutput.id,
      title: useCaseOutput.title,
      description: useCaseOutput.description,
      userId: useCaseOutput.userId,
      status: useCaseOutput.status,
      createdAt: useCaseOutput.createdAt,
      updatedAt: useCaseOutput.updatedAt,
      user: {
        name: useCaseOutput.user.name,
        nickname: useCaseOutput.user.nickname,
        status: useCaseOutput.user.status,
        userType: useCaseOutput.user.userType,
      },
    };

    jest
      .spyOn(RoadmapsMapper, 'mapFetchRoadmapRequestDtoToFetchRoadmapUseCaseInput')
      .mockReturnValue(mappedInput);
    jest
      .spyOn(
        RoadmapsMapper,
        'mapFetchRoadmapUseCaseOutputToFetchRoadmapResponseDto',
      )
      .mockReturnValue(mappedResponse);
    fetchRoadmapUseCase.execute.mockResolvedValue(right(useCaseOutput));

    const result = await controller.fetchById(fetchRoadmapDto);

    expect(
      RoadmapsMapper.mapFetchRoadmapRequestDtoToFetchRoadmapUseCaseInput,
    ).toHaveBeenCalledWith(fetchRoadmapDto);
    expect(fetchRoadmapUseCase.execute).toHaveBeenCalledWith(mappedInput);
    expect(
      RoadmapsMapper.mapFetchRoadmapUseCaseOutputToFetchRoadmapResponseDto,
    ).toHaveBeenCalledWith(useCaseOutput);
    expect(result).toEqual(mappedResponse);
  });

  it('should throw and log when fetch use case returns left', async () => {
    const useCaseError = new RoadmapNotFoundError();
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    fetchRoadmapUseCase.execute.mockResolvedValue(left(useCaseError));

    await expect(controller.fetchById(fetchRoadmapDto)).rejects.toBe(
      useCaseError,
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching roadmap'),
    );
  });

  it('should wrap non error and throw generic fetch roadmap error', async () => {
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    fetchRoadmapUseCase.execute.mockRejectedValue('unexpected');

    await expect(controller.fetchById(fetchRoadmapDto)).rejects.toThrow(
      'Failed to fetch roadmap',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching roadmap: Failed to fetch roadmap'),
    );
  });
});
