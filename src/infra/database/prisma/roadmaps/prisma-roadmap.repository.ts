import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RoadmapRepository } from '@/src/modules/roadmaps/domain/repositories/roadmap-repository';
import { Roadmap } from '@/src/modules/roadmaps/domain/roadmap';
import { PrismaRoadmapMapper } from './mapper/prisma-roadmap.mapper';

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
}
