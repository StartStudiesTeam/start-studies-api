import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RoadmapRepository } from '@/src/modules/roadmaps/domain/repositories/roadmap-repository';
import { Roadmap } from '@/src/modules/roadmaps/domain/roadmap';
import { PrismaRoadmapMapper } from './mapper/prisma-roadmap.mapper';
import { SearchQuery } from '@/src/common/types/pagination/search-users-query.type';
import { PaginatedRoadmapsResult } from '@/src/modules/roadmaps/domain/types/paginated-roadmap-result.type';

@Injectable()
export class PrismaRoadmapRepository extends RoadmapRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async create(roadmap: Roadmap): Promise<Roadmap> {
    const createdRoadmap = await this.prismaService.roadmap.create({
      data: PrismaRoadmapMapper.toPrisma(roadmap),
    });

    return PrismaRoadmapMapper.toEntity(createdRoadmap);
  }

  async findById(id: string): Promise<Roadmap | null> {
    const roadmap = await this.prismaService.roadmap.findUnique({
      where: {
        id,
      },
    });

    if (!roadmap) return null;

    return PrismaRoadmapMapper.toEntity(roadmap);
  }

  async searchByFilters(query: SearchQuery): Promise<PaginatedRoadmapsResult> {
    const normalizedFilter = query.filter?.trim();
    const where = {
      deletedAt: null,
      user: {
        is: {
          deletedAt: null,
        },
      },
      ...(normalizedFilter && {
        OR: [
          {
            title: {
              contains: normalizedFilter,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: normalizedFilter,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const [roadmaps, total] = await this.prismaService.$transaction([
      this.prismaService.roadmap.findMany({
        where,
        take: query.limit,
        skip: query.offset,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              nickname: true,
            },
          },
        },
      }),
      this.prismaService.roadmap.count({ where }),
    ]);

    return {
      roadmaps: roadmaps.map((roadmap) => ({
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        status: roadmap.status as Roadmap['status'],
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
        user: {
          id: roadmap.user.id,
          name: roadmap.user.name,
          nickname: roadmap.user.nickname,
        },
      })),
      total,
    };
  }
}
