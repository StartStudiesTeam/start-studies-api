import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength } from 'class-validator';

export class SearchUsersRequestDto {
  @ApiPropertyOptional({
    example: 'user-name',
    description: 'Filter by name or nickname',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  filter?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'maximum number of records to return',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'number of records to skip before starting the result set',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;
}
