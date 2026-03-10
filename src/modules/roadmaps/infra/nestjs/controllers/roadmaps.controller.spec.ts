import { Logger } from '@nestjs/common';
import { left, right } from '@/src/common/errors/either';
import { CreateRoadmapUseCase } from '../../../application/usecases/create-roadmap/create-roadmap.usecase';
import { CreateRoadmapUseCaseInput } from '../../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { RoadmapStatusEnum } from '../../../domain/enums/roadmap-status.enum';
import { RoadmapCreationUserNotFoundError } from '../../../domain/errors/roadmap-creation-user-not-found-error';
import { CreateRoadmapRequestDto } from '../../dto/create-roadmap.request.dto';
import { RoadmapsMapper } from '../../mappers/roadmaps.mapper';
import { RoadmapsController } from './roadmaps.controller';
import { CreateRoadmapResponseDto } from '../../dto/create-roadmap.response.dto';

describe('RoadmapsController', () => {
  let controller: RoadmapsController;
  let createRoadmapUseCase: jest.Mocked<CreateRoadmapUseCase>;

  const createRoadmapDto: CreateRoadmapRequestDto = {
    title: 'Roadmap Backend',
    description: 'Plano de estudo para evoluir em backend com NestJS.',
    userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
    status: RoadmapStatusEnum.DRAFT,
  };

  beforeEach(() => {
    createRoadmapUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateRoadmapUseCase>;

    controller = new RoadmapsController(createRoadmapUseCase);
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
});
