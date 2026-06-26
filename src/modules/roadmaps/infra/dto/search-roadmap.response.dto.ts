import { ApiProperty } from '@nestjs/swagger';
import { RoadmapStatusEnum } from '../../domain/enums/roadmap-status.enum';

export class SearchRoadmapUserResponseDto {
  @ApiProperty({
    description: 'Roadmap owner identifier',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  id: string;

  @ApiProperty({
    description: 'Roadmap owner name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Roadmap owner nickname',
    example: 'johnny',
  })
  nickname: string;
}

export class SearchRoadmapItemResponseDto {
  @ApiProperty({
    description: 'Roadmap identifier',
    example: '6bd67b85-8dc6-4f8f-a32d-e812f6f8af4f',
  })
  id: string;

  @ApiProperty({
    description: 'Roadmap title',
    example: 'Backend Roadmap',
  })
  title: string;

  @ApiProperty({
    description: 'Roadmap description',
    example: 'Plano para evoluir em APIs com NestJS.',
  })
  description: string;

  @ApiProperty({
    description: 'Roadmap owner data',
    type: SearchRoadmapUserResponseDto,
  })
  user: SearchRoadmapUserResponseDto;

  @ApiProperty({
    description: 'Roadmap status',
    enum: RoadmapStatusEnum,
    example: RoadmapStatusEnum.DRAFT,
  })
  status: RoadmapStatusEnum;

  @ApiProperty({
    description: 'Record creation date',
    example: '2026-02-15T10:12:40.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Record last update date',
    example: '2026-02-15T11:45:10.000Z',
  })
  updatedAt: string;
}

export class SearchRoadmapResponseDto {
  @ApiProperty({
    description: 'Total roadmaps that match the filter',
    example: 12,
  })
  total: number;

  @ApiProperty({
    description: 'List of roadmaps for this page',
    type: [SearchRoadmapItemResponseDto],
  })
  data: SearchRoadmapItemResponseDto[];
}
