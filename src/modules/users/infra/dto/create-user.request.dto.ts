import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserGenderEnum } from '../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../domain/enums/user-type.enum';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of user',
    example: 'user-name-01',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({
    description: 'Nickname of user',
    example: 'maquinadinho',
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  @ApiProperty({
    description: 'user password',
    example: 'bolinha12345',
  })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @ApiProperty({
    description: 'user mail',
    example: 'bolinha@example.com',
  })
  email: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'user date of birth',
    example: '1995-04-23',
  })
  dateOfBirth?: string;

  @IsEnum(UserGenderEnum)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'user gender',
    examples: [UserGenderEnum.MALE, UserGenderEnum.FEMALE],
  })
  gender?: UserGenderEnum;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'phone of user',
    example: '+36209399676',
  })
  phone?: string;

  @IsEnum(UserStatusEnum)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'status of user',
    examples: [UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE],
  })
  status?: UserStatusEnum;

  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: 'type of user',
    examples: [UserTypeEnum.GUEST, UserTypeEnum.USER, UserTypeEnum.ADMIN],
  })
  userType: UserTypeEnum;
}
