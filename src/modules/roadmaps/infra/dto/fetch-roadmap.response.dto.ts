import { ApiProperty } from '@nestjs/swagger';
import { RoadmapStatusEnum } from '../../domain/enums/roadmap-status.enum';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';

export class FetchRoadmapUserResponseDto {
  @ApiProperty({
    description: 'Roadmap owner name',
    example: 'Ruan Brito',
  })
  name: string;

  @ApiProperty({
    description: 'Roadmap owner nickname',
    example: 'ruanzinho',
  })
  nickname: string;

  @ApiProperty({
    description: 'Roadmap owner status',
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @ApiProperty({
    description: 'Roadmap owner type',
    enum: UserTypeEnum,
    example: UserTypeEnum.USER,
  })
  userType: UserTypeEnum;
}

export class FetchRoadmapResponseDto {
  @ApiProperty({
    description: 'Roadmap identifier',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  id: string;

  @ApiProperty({
    description: 'Roadmap title',
    example: 'Backend Roadmap with NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Roadmap description',
    example: 'Steps to study architecture, REST APIs, and databases.',
  })
  description: string;

  @ApiProperty({
    description: 'Identifier of the user who owns the roadmap',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  userId: string;

  @ApiProperty({
    description: 'Roadmap status',
    enum: RoadmapStatusEnum,
    example: RoadmapStatusEnum.DRAFT,
  })
  status: RoadmapStatusEnum;

  @ApiProperty({
    description: 'Roadmap owner information',
    type: FetchRoadmapUserResponseDto,
  })
  user: FetchRoadmapUserResponseDto;

  @ApiProperty({
    description: 'Roadmap creation date',
    example: '2026-02-15T10:12:40.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Roadmap last update date',
    example: '2026-02-15T11:45:10.000Z',
  })
  updatedAt: string;
}
