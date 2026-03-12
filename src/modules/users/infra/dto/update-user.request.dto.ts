import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserGenderEnum } from '../../domain/enums/user-gender.enum';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'Name of user',
    example: 'user-name-01',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiPropertyOptional({
    description: 'Nickname of user',
    example: 'maquinadinho',
  })
  nickname?: string;

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(254)
  @ApiPropertyOptional({
    description: 'User mail',
    example: 'bolinha@example.com',
  })
  email?: string;

  @IsEnum(UserGenderEnum)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'User gender',
    examples: [UserGenderEnum.MALE, UserGenderEnum.FEMALE],
  })
  gender?: UserGenderEnum;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'Phone of user',
    example: '+36209399676',
  })
  phone?: string;
}
