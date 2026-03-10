import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { RoadmapStatusEnum } from '../../domain/enums/roadmap-status.enum';

export class CreateRoadmapRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'Roadmap title',
    example: 'Roadmap de Backend com NestJS',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'Roadmap description',
    example: 'Passos para estudar arquitetura, API REST e banco de dados.',
  })
  description: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User identifier that owns the roadmap',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  userId: string;

  @IsEnum(RoadmapStatusEnum)
  @ApiPropertyOptional({
    description: 'Roadmap status',
    enum: RoadmapStatusEnum,
    example: RoadmapStatusEnum.DRAFT,
  })
  status?: RoadmapStatusEnum;
}
