import { Prisma, Roadmap as PrismaRoadmap } from '@prisma/client';
import { Roadmap } from '@/src/modules/roadmaps/domain/roadmap';
import { RoadmapStatusEnum } from '@/src/modules/roadmaps/domain/enums/roadmap-status.enum';

export class PrismaRoadmapMapper {
  static toEntity(raw: PrismaRoadmap): Roadmap {
    const roadmapOrError = Roadmap.create(
      {
        title: raw.title,
        description: raw.description,
        userId: raw.userId,
        status: raw.status as RoadmapStatusEnum,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      raw.id,
    );

    if (roadmapOrError.isLeft()) {
      throw roadmapOrError.value;
    }

    return roadmapOrError.value;
  }

  static toPrisma(entity: Roadmap): Prisma.RoadmapUncheckedCreateInput {
    return {
      title: entity.title,
      description: entity.description,
      userId: entity.userId,
      status: entity.status ?? RoadmapStatusEnum.DRAFT,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntityList(rawRoadmaps: PrismaRoadmap[]): Roadmap[] {
    return rawRoadmaps.map((rawRoadmap) =>
      PrismaRoadmapMapper.toEntity(rawRoadmap),
    );
  }
}
