import { FetchRoadmapUseCase } from './fetch-roadmap.usecase';
import { RoadmapRepository } from '../../../domain/repositories/roadmap-repository';
import { UserRepository } from '@/src/modules/users/domain/repositories/user-repository';
import { FetchRoadmapUseCaseInput } from './dto/fetch-roadmap.input.dto';
import { Roadmap } from '../../../domain/roadmap';
import { RoadmapStatusEnum } from '../../../domain/enums/roadmap-status.enum';
import { User } from '@/src/modules/users/domain/user';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';
import { RoadmapNotFoundError } from '../../../domain/errors/roadmap-not-found-error';
import { RoadmapFetchUserNotFoundError } from '../../../domain/errors/roadmap-fetch-user-not-found-error';

describe('FetchRoadmapUseCase', () => {
  let useCase: FetchRoadmapUseCase;
  let roadmapRepository: jest.Mocked<RoadmapRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  const input = new FetchRoadmapUseCaseInput({
    id: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
  });

  const persistedRoadmap = Roadmap.create(
    {
      title: 'Roadmap Backend',
      description: 'Plano de estudo para evoluir em backend com NestJS.',
      userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
      status: RoadmapStatusEnum.DRAFT,
    },
    input.id,
  ).value as Roadmap;

  const activeUser = User.create(
    {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johndoe',
      password: 'secret123',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
    },
    persistedRoadmap.userId,
  ).value as User;

  const deletedUser = User.create(
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      nickname: 'janedoe',
      password: 'secret123',
      status: UserStatusEnum.ACTIVE,
      userType: UserTypeEnum.USER,
      deletedAt: new Date(),
    },
    persistedRoadmap.userId,
  ).value as User;

  beforeEach(() => {
    roadmapRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      searchByFilters: jest.fn(),
    } as jest.Mocked<RoadmapRepository>;

    userRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findUniqueByEmail: jest.fn(),
      findByNickname: jest.fn(),
      delete: jest.fn(),
      searchByFilters: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new FetchRoadmapUseCase(roadmapRepository, userRepository);
  });

  it('should fetch a roadmap successfully', async () => {
    roadmapRepository.findById.mockResolvedValue(persistedRoadmap);
    userRepository.findById.mockResolvedValue(activeUser);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBe(persistedRoadmap.id);
      expect(result.value.title).toBe(persistedRoadmap.title);
      expect(result.value.description).toBe(persistedRoadmap.description);
      expect(result.value.userId).toBe(persistedRoadmap.userId);
      expect(result.value.status).toBe(persistedRoadmap.status);
      expect(result.value.user).toEqual({
        name: activeUser.name,
        nickname: activeUser.nickname,
        status: activeUser.status,
        userType: activeUser.userType,
      });
    }
    expect(roadmapRepository.findById).toHaveBeenCalledWith(input.id);
    expect(userRepository.findById).toHaveBeenCalledWith(
      persistedRoadmap.userId,
    );
  });

  it('should return left when roadmap does not exist', async () => {
    roadmapRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapNotFoundError);
      expect(result.value.message).toBe('Roadmap not found');
    }
    expect(roadmapRepository.findById).toHaveBeenCalledWith(input.id);
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('should return left when roadmap user does not exist', async () => {
    roadmapRepository.findById.mockResolvedValue(persistedRoadmap);
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapFetchUserNotFoundError);
    }
  });

  it('should return left when roadmap user is deleted', async () => {
    roadmapRepository.findById.mockResolvedValue(persistedRoadmap);
    userRepository.findById.mockResolvedValue(deletedUser);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapFetchUserNotFoundError);
    }
  });

  it('should return left with repository error', async () => {
    const repositoryError = new Error('Database unavailable');
    roadmapRepository.findById.mockRejectedValue(repositoryError);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe(repositoryError);
    }
  });
});
