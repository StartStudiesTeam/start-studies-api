import { SearchRoadmapUseCase } from './search-roadmap.usecase';
import { RoadmapRepository } from '../../../domain/repositories/roadmap-repository';
import { SearchRoadmapUseCaseInput } from './dto/search-roadmap.input.dto';
import { RoadmapStatusEnum } from '../../../domain/enums/roadmap-status.enum';
import { SearchRoadmapPersistenceError } from '../../../domain/errors/search-roadmap-persistence-error';
import { PaginatedRoadmapsResult } from '../../../domain/types/paginated-roadmap-result.type';

describe('SearchRoadmapUseCase', () => {
  let useCase: SearchRoadmapUseCase;
  let roadmapRepository: jest.Mocked<RoadmapRepository>;

  const firstRoadmap = {
    id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
    title: 'Backend Roadmap',
    description: 'Plano para evoluir em APIs com NestJS.',
    status: RoadmapStatusEnum.DRAFT,
    createdAt: new Date('2026-02-15T10:12:40.000Z'),
    updatedAt: new Date('2026-02-15T11:45:10.000Z'),
    user: {
      id: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      name: 'John Doe',
      nickname: 'johnny',
    },
  };

  const secondRoadmap = {
    id: '7cb1e44c-5be6-4bd8-8c49-e5f91ddda329',
    title: 'Frontend Roadmap',
    description: 'Plano para evoluir em interfaces com React.',
    status: RoadmapStatusEnum.PUBLISHED,
    createdAt: new Date('2026-02-16T10:12:40.000Z'),
    updatedAt: new Date('2026-02-16T11:45:10.000Z'),
    user: {
      id: '2fa91349-2c95-4bf4-91f7-d27e97f66c88',
      name: 'Jane Doe',
      nickname: 'janey',
    },
  };

  beforeEach(() => {
    roadmapRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      searchByFilters: jest.fn(),
    } as jest.Mocked<RoadmapRepository>;

    useCase = new SearchRoadmapUseCase(roadmapRepository);
  });

  it('should search roadmaps successfully', async () => {
    const input = new SearchRoadmapUseCaseInput({
      filter: 'roadmap',
      limit: 10,
      offset: 0,
    });

    roadmapRepository.searchByFilters.mockResolvedValue({
      roadmaps: [firstRoadmap, secondRoadmap],
      total: 2,
    } as PaginatedRoadmapsResult);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.total).toBe(2);
      expect(result.value.data).toHaveLength(2);
      expect(result.value.data[0].id).toBe(firstRoadmap.id);
      expect(result.value.data[1].title).toBe(secondRoadmap.title);
      expect(result.value.data[0].user).toEqual({
        id: firstRoadmap.user.id,
        name: firstRoadmap.user.name,
        nickname: firstRoadmap.user.nickname,
      });
    }

    expect(roadmapRepository.searchByFilters).toHaveBeenCalledWith({
      filter: 'roadmap',
      limit: 10,
      offset: 0,
    });
  });

  it('should return right with empty data when no roadmaps are found', async () => {
    const input = new SearchRoadmapUseCaseInput({
      filter: 'missing',
      limit: 5,
      offset: 0,
    });

    roadmapRepository.searchByFilters.mockResolvedValue({
      roadmaps: [],
      total: 0,
    } as PaginatedRoadmapsResult);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.total).toBe(0);
      expect(result.value.data).toEqual([]);
    }
  });

  it('should apply default pagination values when limit and offset are not provided', async () => {
    const input = new SearchRoadmapUseCaseInput({
      filter: 'backend',
    });

    roadmapRepository.searchByFilters.mockResolvedValue({
      roadmaps: [firstRoadmap],
      total: 1,
    } as PaginatedRoadmapsResult);

    await useCase.execute(input);

    expect(roadmapRepository.searchByFilters).toHaveBeenCalledWith({
      filter: 'backend',
      limit: 20,
      offset: 0,
    });
  });

  it('should return left with typed persistence error when repository fails', async () => {
    const input = new SearchRoadmapUseCaseInput({
      filter: 'backend',
      limit: 20,
      offset: 0,
    });
    const repositoryError = new Error('Database unavailable');

    roadmapRepository.searchByFilters.mockRejectedValue(repositoryError);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SearchRoadmapPersistenceError);
      expect(result.value.message).toBe('Failed to search roadmaps');
    }
  });

  it('should delegate negative offset to repository without validating in use case', async () => {
    const input = new SearchRoadmapUseCaseInput({
      filter: 'backend',
      limit: 20,
      offset: -1,
    });

    roadmapRepository.searchByFilters.mockResolvedValue({
      roadmaps: [firstRoadmap],
      total: 1,
    } as PaginatedRoadmapsResult);

    await useCase.execute(input);

    expect(roadmapRepository.searchByFilters).toHaveBeenCalledWith({
      filter: 'backend',
      limit: 20,
      offset: -1,
    });
  });
});
