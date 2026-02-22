import { User } from '../../domain/user';
import { CreateUserUseCaseInput } from '../../application/usecases/create-user/dto/create-user.input.dto';
import { CreateUserUseCaseOutput } from '../../application/usecases/create-user/dto/create-user.output.dto';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserStatusEnum } from '../../domain/enums/user-status.enum';
import { FetchUserUseCaseOutput } from '../../application/usecases/fetch-user/dto/fetch-user.output.dto';
import { FetchUserUseCaseInput } from '../../application/usecases/fetch-user/dto/fetch-user.input.dto';
import { FetchUserRequestDto } from '../dto/fetch-user.request.dto';
import { SearchUsersRequestDto } from '../dto/search-users.request.dto';
import { UpdateUserRequestDto } from '../dto/update-user.request.dto';
import {
  SearchUsersItemResponseDto,
  SearchUsersResponseDto,
} from '../dto/search-users.response.dto';
import { SearchUsersUseCaseInput } from '../../application/usecases/search-users/dto/search-users.input.dto';
import {
  SearchUsersOutputItem,
  SearchUsersUseCaseOutput,
} from '../../application/usecases/search-users/dto/search-users.output.dto';
import { UpdateUserUseCaseOutput } from '../../application/usecases/update-user/dto/update-user.output.dto';
import { UpdateUserUseCaseInput } from '../../application/usecases/update-user/dto/update-user.input.dto';
import { SearchUsersQuery } from '../../domain/types/search-users-query.type';
import { PaginatedUsersResult } from '../../domain/types/paginated-users-result.type';

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

  static mapUpdateUserInputToUser(
    existingUser: User,
    newUser: UpdateUserUseCaseInput,
  ): User {
    const fieldsToUpdate = {
      ...(newUser.name !== undefined && { name: newUser.name }),
      ...(newUser.email !== undefined && { email: newUser.email }),
      ...(newUser.nickname !== undefined && { nickname: newUser.nickname }),
      ...(newUser.gender !== undefined && { gender: newUser.gender }),
      ...(newUser.phone !== undefined && { phone: newUser.phone }),
    };

    Object.assign(existingUser, fieldsToUpdate);

    return existingUser;
  }

  static mapUpdateRequestToUpdateUserUseCaseInput(
    id: string,
    body: UpdateUserRequestDto,
  ): UpdateUserUseCaseInput {
    return new UpdateUserUseCaseInput({
      id,
      name: body.name,
      email: body.email,
      nickname: body.nickname,
      gender: body.gender,
      phone: body.phone,
    });
  }

  static mapUserToUpdateUserUseCaseOutput(user: User): UpdateUserUseCaseOutput {
    return new UpdateUserUseCaseOutput({
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

  static mapSearchUsersRequestDtoToSearchUsersUseCaseInput(
    dto: SearchUsersRequestDto,
  ): SearchUsersUseCaseInput {
    return {
      filter: dto.filter,
      limit: dto.limit,
      offset: dto.offset,
    };
  }

  static mapToDomainQuery(input: SearchUsersUseCaseInput): SearchUsersQuery {
    return {
      filter: input.filter,
      limit: input.limit ?? 20,
      offset: input.offset ?? 0,
    };
  }

  static mapSearchUsersToOutput(
    searchResult: PaginatedUsersResult,
  ): SearchUsersUseCaseOutput {
    const data = searchResult.users.map(
      (user) =>
        new SearchUsersOutputItem({
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
        }),
    );

    return new SearchUsersUseCaseOutput({
      total: searchResult.total,
      data,
    });
  }

  static mapSearchUsersUseCaseOutputToSearchUsersResponseDto(
    output: SearchUsersUseCaseOutput,
  ): SearchUsersResponseDto {
    return {
      total: output.total,
      data: output.data.map(
        (user): SearchUsersItemResponseDto => ({
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.nickname,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          phone: user.phone,
          status: user.status,
          userType: user.userType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
      ),
    };
  }
}
