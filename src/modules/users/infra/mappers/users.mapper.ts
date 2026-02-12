import { User } from '../../domain/user';
import { CreateUserUseCaseInput } from '../../application/usecases/create-user/dto/create-user.input.dto';
import { CreateUserUseCaseOutput } from '../../application/usecases/create-user/dto/create-user.output.dto';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';

export class UsersMapper {
  static mapCreateUserRequestDtoToCreateUserUseCaseInput(
    dto: CreateUserRequestDto,
  ): CreateUserUseCaseInput {
    return {
      name: dto.name,
      email: dto.email,
      nickname: dto.nickname,
      password: dto.password,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      phone: dto.phone,
      status: dto.status,
      userType: dto.userType,
    };
  }

  static mapUserToCreateUserUseCaseOutput(user: User): CreateUserUseCaseOutput {
    return new CreateUserUseCaseOutput({
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      userType: user.userType,
      status: user.status ?? UserStatusEnum.ACTIVE,
      ...(user.dateOfBirth && {
        dateOfBirth: user.dateOfBirth,
      }),
      ...(user.gender && {
        gender: user.gender,
      }),
      ...(user.phone && {
        phone: user.phone,
      }),
    });
  }
}
