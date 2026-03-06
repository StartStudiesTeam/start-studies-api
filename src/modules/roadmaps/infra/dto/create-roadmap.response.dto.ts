import { ApiProperty } from '@nestjs/swagger';
import { RoadmapStatusEnum } from '../../domain/enums/roadmap-status.enum';

export class CreateRoadmapResponseDto {
  @ApiProperty({
    description: 'Roadmap identifier',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  id: string;

  @ApiProperty({
    description: 'Roadmap title',
    example: 'Roadmap de Backend com NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Roadmap description',
    example: 'Passos para estudar arquitetura, API REST e banco de dados.',
  })
  description: string;

  @ApiProperty({
    description: 'User identifier that owns the roadmap',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  userId: string;

  @ApiProperty({
    description: 'Roadmap status',
    enum: RoadmapStatusEnum,
    example: RoadmapStatusEnum.DRAFT,
  })
  status: RoadmapStatusEnum;
}
