import { CreateRoadmapUseCaseInput } from '../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { FetchRoadmapUseCaseOutput } from '../../application/usecases/fetch-roadmap/dto/fetch-roadmap.output.dto';
import { SearchRoadmapUseCaseInput } from '../../application/usecases/search-roadmap/dto/search-roadmap.input.dto';
import {
  SearchRoadmapOutputItem,
  SearchRoadmapUserOutputItem,
  SearchRoadmapUseCaseOutput,
} from '../../application/usecases/search-roadmap/dto/search-roadmap.output.dto';
import { RoadmapStatusEnum } from '../../domain/enums/roadmap-status.enum';
import { Roadmap } from '../../domain/roadmap';
import { PaginatedRoadmapsResult } from '../../domain/types/paginated-roadmap-result.type';
import { CreateRoadmapRequestDto } from '../dto/create-roadmap.request.dto';
import { CreateRoadmapResponseDto } from '../dto/create-roadmap.response.dto';
import { FetchRoadmapRequestDto } from '../dto/fetch-roadmap.request.dto';
import { FetchRoadmapResponseDto } from '../dto/fetch-roadmap.response.dto';
import { SearchRoadmapRequestDto } from '../dto/search-roadmap.request.dto';
import { SearchRoadmapResponseDto } from '../dto/search-roadmap.response.dto';
import { RoadmapsMapper } from './roadmaps.mapper';
import { User } from '@/src/modules/users/domain/user';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';

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

  describe('mapRoadmapToFetchRoadmapUseCaseOutput', () => {
    it('should map roadmap and user entities to fetch roadmap use case output', () => {
      const roadmap = Roadmap.create(
        {
          title: 'Roadmap Backend',
          description: 'Plano de estudo para evoluir em backend com NestJS.',
          userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
          status: RoadmapStatusEnum.DRAFT,
          createdAt: new Date('2026-02-15T10:12:40.000Z'),
          updatedAt: new Date('2026-02-15T11:45:10.000Z'),
        },
        '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
      ).value as Roadmap;

      const user = User.create(
        {
          name: 'John Doe',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'secret123',
          status: UserStatusEnum.ACTIVE,
          userType: UserTypeEnum.USER,
        },
        roadmap.userId,
      ).value as User;

      const result = RoadmapsMapper.mapRoadmapToFetchRoadmapUseCaseOutput(
        roadmap,
        user,
      );

      expect(result).toBeInstanceOf(FetchRoadmapUseCaseOutput);
      expect(result).toEqual(
        expect.objectContaining({
          id: roadmap.id,
          title: roadmap.title,
          description: roadmap.description,
          userId: roadmap.userId,
          status: roadmap.status,
          createdAt: roadmap.createdAt,
          updatedAt: roadmap.updatedAt,
          user: {
            name: user.name,
            nickname: user.nickname,
            status: user.status,
            userType: user.userType,
          },
        }),
      );
    });
  });

  describe('mapFetchRoadmapRequestDtoToFetchRoadmapUseCaseInput', () => {
    it('should map request dto to fetch roadmap use case input', () => {
      const dto: FetchRoadmapRequestDto = {
        id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
      };

      const result =
        RoadmapsMapper.mapFetchRoadmapRequestDtoToFetchRoadmapUseCaseInput(dto);

      expect(result).toEqual({
        id: dto.id,
      });
    });
  });

  describe('mapFetchRoadmapUseCaseOutputToFetchRoadmapResponseDto', () => {
    it('should map fetch roadmap use case output to response dto', () => {
      const output = new FetchRoadmapUseCaseOutput({
        id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
        title: 'Roadmap Backend',
        description: 'Plano de estudo para evoluir em backend com NestJS.',
        userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
        status: RoadmapStatusEnum.DRAFT,
        createdAt: new Date('2026-02-15T10:12:40.000Z'),
        updatedAt: new Date('2026-02-15T11:45:10.000Z'),
        user: {
          name: 'John Doe',
          nickname: 'johnny',
          status: UserStatusEnum.ACTIVE,
          userType: UserTypeEnum.USER,
        },
      });

      const result =
        RoadmapsMapper.mapFetchRoadmapUseCaseOutputToFetchRoadmapResponseDto(
          output,
        );

      expect(result).toEqual<FetchRoadmapResponseDto>({
        id: output.id,
        title: output.title,
        description: output.description,
        userId: output.userId,
        status: output.status,
        createdAt: output.createdAt,
        updatedAt: output.updatedAt,
        user: {
          name: output.user.name,
          nickname: output.user.nickname,
          status: output.user.status,
          userType: output.user.userType,
        },
      });
    });
  });

  describe('mapToDomainQuery', () => {
    it('should map input to domain query with default pagination', () => {
      const input = new SearchRoadmapUseCaseInput({
        filter: 'backend',
      });

      const result = RoadmapsMapper.mapToDomainQuery(input);

      expect(result).toEqual({
        filter: 'backend',
        limit: 20,
        offset: 0,
      });
    });

    it('should preserve explicit pagination values', () => {
      const input = new SearchRoadmapUseCaseInput({
        filter: 'frontend',
        limit: 5,
        offset: 10,
      });

      const result = RoadmapsMapper.mapToDomainQuery(input);

      expect(result).toEqual({
        filter: 'frontend',
        limit: 5,
        offset: 10,
      });
    });
  });

  describe('mapSearchRoadmapRequestDtoToSearchRoadmapUseCaseInput', () => {
    it('should map request dto to search roadmap use case input', () => {
      const dto: SearchRoadmapRequestDto = {
        filter: 'backend',
        limit: 10,
        offset: 5,
      };

      const result =
        RoadmapsMapper.mapSearchRoadmapRequestDtoToSearchRoadmapUseCaseInput(
          dto,
        );

      expect(result).toBeInstanceOf(SearchRoadmapUseCaseInput);
      expect(result).toEqual({
        filter: dto.filter,
        limit: dto.limit,
        offset: dto.offset,
      });
    });
  });

  describe('mapSearchRoadmapsToOutput', () => {
    it('should map paginated roadmaps to search roadmap output', () => {
      const roadmap = Roadmap.create(
        {
          title: 'Roadmap Backend',
          description: 'Plano de estudo para evoluir em backend com NestJS.',
          userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
          status: RoadmapStatusEnum.DRAFT,
          createdAt: new Date('2026-02-15T10:12:40.000Z'),
          updatedAt: new Date('2026-02-15T11:45:10.000Z'),
        },
        '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
      ).value as Roadmap;

      const searchResult: PaginatedRoadmapsResult = {
        roadmaps: [
          {
            id: roadmap.id,
            title: roadmap.title,
            description: roadmap.description,
            status: roadmap.status,
            createdAt: roadmap.createdAt,
            updatedAt: roadmap.updatedAt,
            user: {
              id: roadmap.userId,
              name: 'John Doe',
              nickname: 'johnny',
            },
          },
        ],
        total: 1,
      };

      const result = RoadmapsMapper.mapSearchRoadmapsToOutput(searchResult);

      expect(result).toBeInstanceOf(SearchRoadmapUseCaseOutput);
      expect(result).toEqual(
        expect.objectContaining({
          total: 1,
          data: [
            expect.objectContaining({
              id: roadmap.id,
              title: roadmap.title,
              description: roadmap.description,
              user: expect.objectContaining({
                id: roadmap.userId,
                name: 'John Doe',
                nickname: 'johnny',
              }),
              status: roadmap.status,
              createdAt: roadmap.createdAt,
              updatedAt: roadmap.updatedAt,
            }),
          ],
        }),
      );
    });
  });

  describe('mapSearchRoadmapUseCaseOutputToSearchRoadmapResponseDto', () => {
    it('should map search roadmap use case output to response dto', () => {
      const output = new SearchRoadmapUseCaseOutput({
        total: 1,
        data: [
          new SearchRoadmapOutputItem({
            id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
            title: 'Roadmap Backend',
            description: 'Plano de estudo para evoluir em backend com NestJS.',
            user: new SearchRoadmapUserOutputItem({
              id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
              name: 'John Doe',
              nickname: 'johnny',
            }),
            status: RoadmapStatusEnum.DRAFT,
            createdAt: '2026-02-15T10:12:40.000Z',
            updatedAt: '2026-02-15T11:45:10.000Z',
          }),
        ],
      });

      const result =
        RoadmapsMapper.mapSearchRoadmapUseCaseOutputToSearchRoadmapResponseDto(
          output,
        );

      expect(result).toEqual<SearchRoadmapResponseDto>({
        total: 1,
        data: [
          {
            id: output.data[0].id,
            title: output.data[0].title,
            description: output.data[0].description,
            user: {
              id: output.data[0].user.id,
              name: output.data[0].user.name,
              nickname: output.data[0].user.nickname,
            },
            status: output.data[0].status,
            createdAt: output.data[0].createdAt,
            updatedAt: output.data[0].updatedAt,
          },
        ],
      });
    });
  });
});
