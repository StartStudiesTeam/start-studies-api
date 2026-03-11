import { CreateRoadmapUseCase } from './create-roadmap.usecase';
import { UserRepository } from '@/src/modules/users/domain/repositories/user-repository';
import { RoadmapRepository } from '../../../domain/repositories/roadmap-repository';
import { CreateRoadmapUseCaseInput } from './dto/create-roadmap.input.dto';
import { RoadmapStatusEnum } from '../../../domain/enums/roadmap-status.enum';
import { User } from '@/src/modules/users/domain/user';
import { Roadmap } from '../../../domain/roadmap';
import { RoadmapCreationUserNotFoundError } from '../../../domain/errors/roadmap-creation-user-not-found-error';
import { RoadmapCreationUserDeletedError } from '../../../domain/errors/roadmap-creation-user-deleted-error';
import { RoadmapCreationPersistenceError } from '../../../domain/errors/roadmap-creation-persistence-error';
import { RoadmapInvalidDataError } from '../../../domain/errors/roadmap-invalid-data-error';

describe('CreateRoadmapUseCase', () => {
  let useCase: CreateRoadmapUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let roadmapRepository: jest.Mocked<RoadmapRepository>;

  const input: CreateRoadmapUseCaseInput = new CreateRoadmapUseCaseInput({
    title: 'Roadmap Backend',
    description: 'Plano de estudo para evoluir em backend com NestJS.',
    userId: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
    status: RoadmapStatusEnum.DRAFT,
  });

  const activeUser = User.create(
    {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johndoe',
      password: 'secret123',
      userType: 'user',
      deletedAt: null,
    },
    input.userId,
  ).value as User;

  const deletedUser = User.create(
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      nickname: 'janedoe',
      password: 'secret123',
      userType: 'user',
      deletedAt: new Date(),
    },
    input.userId,
  ).value as User;

  const persistedRoadmap = Roadmap.create(
    {
      title: input.title,
      description: input.description,
      userId: input.userId,
      status: input.status,
    },
    '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
  ).value as Roadmap;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findUniqueByEmail: jest.fn(),
      findByNickname: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByFilters: jest.fn(),
    } as jest.Mocked<UserRepository>;

    roadmapRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<RoadmapRepository>;

    useCase = new CreateRoadmapUseCase(userRepository, roadmapRepository);
  });

  it('should create a roadmap successfully', async () => {
    userRepository.findById.mockResolvedValue(activeUser);
    roadmapRepository.create.mockResolvedValue(persistedRoadmap);

    const result = await useCase.execute(input);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBe(persistedRoadmap.id);
      expect(result.value.title).toBe(persistedRoadmap.title);
      expect(result.value.description).toBe(persistedRoadmap.description);
      expect(result.value.userId).toBe(persistedRoadmap.userId);
      expect(result.value.status).toBe(persistedRoadmap.status);
    }
    expect(roadmapRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: input.title,
        description: input.description,
        userId: input.userId,
      }),
    );
  });

  it('should return left when user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapCreationUserNotFoundError);
    }
    expect(roadmapRepository.create).not.toHaveBeenCalled();
  });

  it('should return left when user is deleted', async () => {
    userRepository.findById.mockResolvedValue(deletedUser);

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapCreationUserDeletedError);
    }
    expect(roadmapRepository.create).not.toHaveBeenCalled();
  });

  it('should return left when roadmap data is invalid', async () => {
    userRepository.findById.mockResolvedValue(activeUser);

    const invalidInput = new CreateRoadmapUseCaseInput({
      ...input,
      title: 'abc',
    });

    const result = await useCase.execute(invalidInput);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapInvalidDataError);
    }
    expect(roadmapRepository.create).not.toHaveBeenCalled();
  });

  it('should return left with persistence error when repository throws', async () => {
    userRepository.findById.mockResolvedValue(activeUser);
    roadmapRepository.create.mockRejectedValue(new Error('db unavailable'));

    const result = await useCase.execute(input);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(RoadmapCreationPersistenceError);
    }
  });
});
