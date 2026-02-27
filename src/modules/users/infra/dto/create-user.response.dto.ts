import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGenderEnum } from '../../domain/enums/user-gender.enum';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { UserTypeEnum } from '../../domain/enums/user-type.enum';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'User identifier',
    example: 'd0fd623b-d048-47f0-bdde-8c32bac4c6aa',
  })
  id: string;

  @ApiProperty({
    description: 'Name of user',
    example: 'user-name-01',
  })
  name: string;

  @ApiProperty({
    description: 'User mail',
    example: 'bolinha@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nickname of user',
    example: 'maquinadinho',
  })
  nickname: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1995-04-23',
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'User gender',
    enum: UserGenderEnum,
    example: UserGenderEnum.MALE,
  })
  gender?: UserGenderEnum;

  @ApiPropertyOptional({
    description: 'Phone of user',
    example: '+36209399676',
  })
  phone?: string;

  @ApiProperty({
    description: 'Status of user',
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @ApiProperty({
    description: 'Type of user',
    enum: UserTypeEnum,
    example: UserTypeEnum.USER,
  })
  userType: UserTypeEnum;
}
