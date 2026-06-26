import { Logger } from '@nestjs/common';
import { left, right } from '@/src/common/errors/either';
import { CreateRoadmapUseCase } from '../../../application/usecases/create-roadmap/create-roadmap.usecase';
import { CreateRoadmapUseCaseInput } from '../../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { FetchRoadmapUseCase } from '../../../application/usecases/fetch-roadmap/fetch-roadmap.usecase';
import { FetchRoadmapUseCaseInput } from '../../../application/usecases/fetch-roadmap/dto/fetch-roadmap.input.dto';
import { FetchRoadmapUseCaseOutput } from '../../../application/usecases/fetch-roadmap/dto/fetch-roadmap.output.dto';
import { SearchRoadmapUseCase } from '../../../application/usecases/search-roadmap/search-roadmap.usecase';
import { SearchRoadmapUseCaseInput } from '../../../application/usecases/search-roadmap/dto/search-roadmap.input.dto';
import {
  SearchRoadmapOutputItem,
  SearchRoadmapUseCaseOutput,
  SearchRoadmapUserOutputItem,
} from '../../../application/usecases/search-roadmap/dto/search-roadmap.output.dto';
import { RoadmapStatusEnum } from '../../../domain/enums/roadmap-status.enum';
import { RoadmapCreationUserNotFoundError } from '../../../domain/errors/roadmap-creation-user-not-found-error';
import { RoadmapNotFoundError } from '../../../domain/errors/roadmap-not-found-error';
import { SearchRoadmapPersistenceError } from '../../../domain/errors/search-roadmap-persistence-error';
import { CreateRoadmapRequestDto } from '../../dto/create-roadmap.request.dto';
import { FetchRoadmapRequestDto } from '../../dto/fetch-roadmap.request.dto';
import { FetchRoadmapResponseDto } from '../../dto/fetch-roadmap.response.dto';
import { SearchRoadmapRequestDto } from '../../dto/search-roadmap.request.dto';
import { SearchRoadmapResponseDto } from '../../dto/search-roadmap.response.dto';
import { RoadmapsMapper } from '../../mappers/roadmaps.mapper';
import { RoadmapsController } from './roadmaps.controller';
import { CreateRoadmapResponseDto } from '../../dto/create-roadmap.response.dto';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';

describe('RoadmapsController', () => {
  let controller: RoadmapsController;
  let createRoadmapUseCase: jest.Mocked<CreateRoadmapUseCase>;
  let fetchRoadmapUseCase: jest.Mocked<FetchRoadmapUseCase>;
  let searchRoadmapUseCase: jest.Mocked<SearchRoadmapUseCase>;

  const createRoadmapDto: CreateRoadmapRequestDto = {
    title: 'Roadmap Backend',
    description: 'Plano de estudo para evoluir em backend com NestJS.',
    userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
    status: RoadmapStatusEnum.DRAFT,
  };

  const fetchRoadmapDto: FetchRoadmapRequestDto = {
    id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
  };

  const searchRoadmapDto: SearchRoadmapRequestDto = {
    filter: 'backend',
    limit: 10,
    offset: 0,
  };

  beforeEach(() => {
    createRoadmapUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateRoadmapUseCase>;

    fetchRoadmapUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FetchRoadmapUseCase>;

    searchRoadmapUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SearchRoadmapUseCase>;

    controller = new RoadmapsController(
      createRoadmapUseCase,
      fetchRoadmapUseCase,
      searchRoadmapUseCase,
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

  it('should map request and return searched roadmaps response', async () => {
    const mappedInput = new SearchRoadmapUseCaseInput({
      filter: searchRoadmapDto.filter,
      limit: searchRoadmapDto.limit,
      offset: searchRoadmapDto.offset,
    });

    const useCaseOutput = new SearchRoadmapUseCaseOutput({
      total: 1,
      data: [
        new SearchRoadmapOutputItem({
          id: fetchRoadmapDto.id,
          title: 'Roadmap Backend',
          description: 'Plano de estudo para evoluir em backend com NestJS.',
          user: new SearchRoadmapUserOutputItem({
            id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
            name: 'Ruan Brito',
            nickname: 'ruanzinho',
          }),
          status: RoadmapStatusEnum.DRAFT,
          createdAt: '2026-02-15T10:12:40.000Z',
          updatedAt: '2026-02-15T11:45:10.000Z',
        }),
      ],
    });

    const mappedResponse: SearchRoadmapResponseDto = {
      total: 1,
      data: [
        {
          id: useCaseOutput.data[0].id,
          title: useCaseOutput.data[0].title,
          description: useCaseOutput.data[0].description,
          user: {
            id: useCaseOutput.data[0].user.id,
            name: useCaseOutput.data[0].user.name,
            nickname: useCaseOutput.data[0].user.nickname,
          },
          status: useCaseOutput.data[0].status,
          createdAt: useCaseOutput.data[0].createdAt,
          updatedAt: useCaseOutput.data[0].updatedAt,
        },
      ],
    };

    jest
      .spyOn(
        RoadmapsMapper,
        'mapSearchRoadmapRequestDtoToSearchRoadmapUseCaseInput',
      )
      .mockReturnValue(mappedInput);
    jest
      .spyOn(
        RoadmapsMapper,
        'mapSearchRoadmapUseCaseOutputToSearchRoadmapResponseDto',
      )
      .mockReturnValue(mappedResponse);
    searchRoadmapUseCase.execute.mockResolvedValue(right(useCaseOutput));

    const result = await controller.searchRoadmaps(searchRoadmapDto);

    expect(
      RoadmapsMapper.mapSearchRoadmapRequestDtoToSearchRoadmapUseCaseInput,
    ).toHaveBeenCalledWith(searchRoadmapDto);
    expect(searchRoadmapUseCase.execute).toHaveBeenCalledWith(mappedInput);
    expect(
      RoadmapsMapper.mapSearchRoadmapUseCaseOutputToSearchRoadmapResponseDto,
    ).toHaveBeenCalledWith(useCaseOutput);
    expect(result).toEqual(mappedResponse);
  });

  it('should throw and log when search use case returns left', async () => {
    const useCaseError = new SearchRoadmapPersistenceError();
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    searchRoadmapUseCase.execute.mockResolvedValue(left(useCaseError));

    await expect(controller.searchRoadmaps(searchRoadmapDto)).rejects.toBe(
      useCaseError,
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error searching roadmaps'),
    );
  });

  it('should wrap non error and throw generic search roadmap error', async () => {
    const logger = Reflect.get(controller, 'logger') as Logger;
    const loggerErrorSpy = jest
      .spyOn(logger, 'error')
      .mockImplementation(() => undefined);

    searchRoadmapUseCase.execute.mockRejectedValue('unexpected');

    await expect(controller.searchRoadmaps(searchRoadmapDto)).rejects.toThrow(
      'Failed to search roadmaps',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error searching roadmaps: Failed to search roadmaps',
      ),
    );
  });
});
