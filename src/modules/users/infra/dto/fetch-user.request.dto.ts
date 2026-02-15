import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FetchUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User identifier',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  id: string;
}
