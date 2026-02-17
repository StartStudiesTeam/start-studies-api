import { User } from '../../domain/user';
import { CreateUserUseCaseInput } from '../../application/usecases/create-user/dto/create-user.input.dto';
import { CreateUserUseCaseOutput } from '../../application/usecases/create-user/dto/create-user.output.dto';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { FetchUserUseCaseOutput } from '../../application/usecases/fetch-user/dto/fetch-user.output.dto';
import { FetchUserUseCaseInput } from '../../application/usecases/fetch-user/dto/fetch-user.input.dto';
import { FetchUserRequestDto } from '../dto/fetch-user.request.dto';

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

  static mapFetchUserRequestDtoToFetchUserUseCaseInput(
    dto: FetchUserRequestDto,
  ): FetchUserUseCaseInput {
    return {
      id: dto.id,
    };
  }

  static mapUserToFetchUserUseCaseOutput(user: User): FetchUserUseCaseOutput {
    return new FetchUserUseCaseOutput({
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      userType: user.userType,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
