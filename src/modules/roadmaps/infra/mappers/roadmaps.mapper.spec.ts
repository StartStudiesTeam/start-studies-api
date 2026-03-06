import { CreateRoadmapUseCaseInput } from '../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { RoadmapStatusEnum } from '../../domain/enums/roadmap-status.enum';
import { Roadmap } from '../../domain/roadmap';
import { CreateRoadmapRequestDto } from '../dto/create-roadmap.request.dto';
import { CreateRoadmapResponseDto } from '../dto/create-roadmap.response.dto';
import { RoadmapsMapper } from './roadmaps.mapper';

describe('RoadmapsMapper', () => {
  describe('mapCreateRoadmapRequestDtoToCreateRoadmapUseCaseInput', () => {
    it('should map request dto to use case input', () => {
      const dto: CreateRoadmapRequestDto = {
        title: 'Roadmap Backend',
        description: 'Plano de estudo para evoluir em backend com NestJS.',
        userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
        status: RoadmapStatusEnum.DRAFT,
      };

      const result =
        RoadmapsMapper.mapCreateRoadmapRequestDtoToCreateRoadmapUseCaseInput(
          dto,
        );

      expect(result).toBeInstanceOf(CreateRoadmapUseCaseInput);
      expect(result).toEqual({
        title: dto.title,
        description: dto.description,
        userId: dto.userId,
        status: dto.status,
      });
    });
  });

  describe('mapCreateRoadmapUseCaseOutputToCreateRoadmapResponseDto', () => {
    it('should map use case output to response dto', () => {
      const output = new CreateRoadmapUseCaseOutput({
        id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
        title: 'Roadmap Backend',
        description: 'Plano de estudo para evoluir em backend com NestJS.',
        userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
        status: RoadmapStatusEnum.DRAFT,
      });

      const result =
        RoadmapsMapper.mapCreateRoadmapUseCaseOutputToCreateRoadmapResponseDto(
          output,
        );

      expect(result).toEqual<CreateRoadmapResponseDto>({
        id: output.id,
        title: output.title,
        description: output.description,
        userId: output.userId,
        status: output.status,
      });
    });
  });

  describe('mapRoadmapToCreateRoadmapUseCaseOutput', () => {
    it('should map roadmap entity to create roadmap use case output', () => {
      const roadmap = Roadmap.create(
        {
          title: 'Roadmap Backend',
          description: 'Plano de estudo para evoluir em backend com NestJS.',
          userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
          status: RoadmapStatusEnum.DRAFT,
        },
        '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
      ).value as Roadmap;

      const result =
        RoadmapsMapper.mapRoadmapToCreateRoadmapUseCaseOutput(roadmap);

      expect(result).toBeInstanceOf(CreateRoadmapUseCaseOutput);
      expect(result).toEqual(
        expect.objectContaining({
          id: roadmap.id,
          title: roadmap.title,
          description: roadmap.description,
          userId: roadmap.userId,
          status: roadmap.status,
        }),
      );
    });
  });
});
