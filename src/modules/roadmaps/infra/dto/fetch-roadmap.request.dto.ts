import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FetchRoadmapRequestDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Roadmap identifier',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  id: string;
}
