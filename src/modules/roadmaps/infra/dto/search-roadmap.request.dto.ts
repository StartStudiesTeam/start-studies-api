import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SearchRoadmapRequestDto {
  @ApiPropertyOptional({
    example: 'backend',
    description: 'Filter by roadmap title or description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  filter?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Maximum number of records to return',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of records to skip before starting the result set',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
