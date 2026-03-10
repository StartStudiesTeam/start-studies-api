import { DatabaseModule } from '@/src/infra/database/database.module';
import { Module } from '@nestjs/common';
import { UserRepository } from '../users/domain/repositories/user-repository';
import { PrismaUserRepository } from '@/src/infra/database/prisma/users/prisma-user.repository';
import { RoadmapRepository } from './domain/repositories/roadmap-repository';
import { CreateRoadmapUseCase } from './application/usecases/create-roadmap/create-roadmap.usecase';
import { RoadmapsController } from './infra/nestjs/controllers/roadmaps.controller';
import { PrismaRoadmapRepository } from '@/src/infra/database/prisma/roadmaps/prisma-roadmap.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [RoadmapsController],
  providers: [
    CreateRoadmapUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: RoadmapRepository,
      useClass: PrismaRoadmapRepository,
    },
  ],
})
export class RoadmapsModule {}
