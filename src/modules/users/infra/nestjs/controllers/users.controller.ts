import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDto } from '../../dto/create-user.request.dto';
import { CreateUserUseCase } from '../../../application/usecases/create-user/create-user.usecase';
import { CreateUserResponseDto } from '../../dto/create-user.response.dto';
import { UsersMapper } from '../../mappers/users.mapper';
import { FetchUserRequestDto } from '../../dto/fetch-user.request.dto';
import { FetchUserUseCase } from '../../../application/usecases/fetch-user/fetch-user.usecase';
import { FetchUserResponseDto } from '../../dto/fetch-user.response.dto';
import { SearchUsersRequestDto } from '../../dto/search-users.request.dto';
import { SearchUsersUseCase } from '../../../application/usecases/search-users/search-users.usecase';
import { SearchUsersResponseDto } from '../../dto/search-users.response.dto';
import { UpdateUserUseCase } from '../../../application/usecases/update-user/update-user.usecase';
import { UpdateUserRequestDto } from '../../dto/update-user.request.dto';
import { UpdateUserResponseDto } from '../../dto/update-user.response.dto';
import { DeleteUserUseCase } from '../../../application/usecases/delete-user/delete-user.usecase';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  private readonly logger: Logger;

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly fetchUserUseCase: FetchUserUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {
    this.logger = new Logger(UsersController.name);
  }

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserResponseDto,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @Post()
  async create(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    this.logger.log(`Call ${UsersController.name}.create method`);
    try {
      this.logger.log(
        `CreateUserRequestDto received: ${JSON.stringify(createUserDto)}`,
      );

      const input =
        UsersMapper.mapCreateUserRequestDtoToCreateUserUseCaseInput(
          createUserDto,
        );

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.createUserUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(`User created successfully - ${result.value.id} `);

      return result.value;
    } catch (error) {
      this.logger.error(
        `Error creating user: ${error.message} stack: ${error.stack}`,
      );
    }
  }

  @ApiOperation({
    summary: 'Fetch a user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FetchUserResponseDto,
    description: 'User fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @Get(':id')
  async fetchById(
    @Param() fetchUserDto: FetchUserRequestDto,
  ): Promise<FetchUserResponseDto> {
    this.logger.log(`Call ${UsersController.name}.fetchById method`);
    try {
      this.logger.log(`Fetch user request received with id=${fetchUserDto.id}`);

      const input =
        UsersMapper.mapFetchUserRequestDtoToFetchUserUseCaseInput(fetchUserDto);

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.fetchUserUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(`User fetched successfully - ${result.value.id}`);

      return result.value;
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to fetch user');
      this.logger.error(
        `Error fetching user: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }

  @ApiOperation({
    summary: 'Search users by filters',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SearchUsersResponseDto,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request parameters',
  })
  @Get()
  async searchUsers(
    @Query() searchUsersDto: SearchUsersRequestDto,
  ): Promise<SearchUsersResponseDto> {
    this.logger.log(`Call ${UsersController.name}.searchUsers method`);
    try {
      this.logger.log(
        `SearchUsersRequestDto received: ${JSON.stringify(searchUsersDto)}`,
      );

      const input =
        UsersMapper.mapSearchUsersRequestDtoToSearchUsersUseCaseInput(
          searchUsersDto,
        );

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.searchUsersUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(
        `Users retrieved successfully - count=${result.value.data.length}, total=${result.value.total}`,
      );

      return UsersMapper.mapSearchUsersUseCaseOutputToSearchUsersResponseDto(
        result.value,
      );
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to search users');
      this.logger.error(
        `Error searching users: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }

  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateUserResponseDto,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    this.logger.log(`Call ${UsersController.name}.update method`);
    try {
      this.logger.log(
        `UpdateUserRequestDto received with id=${id} and body=${JSON.stringify(updateUserDto)}`,
      );

      const input = UsersMapper.mapUpdateRequestToUpdateUserUseCaseInput(
        id,
        updateUserDto,
      );

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.updateUserUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(`User updated successfully - ${result.value.id}`);

      return result.value;
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to update user');
      this.logger.error(
        `Error updating user: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }

  @ApiOperation({
    summary: 'Delete a user',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    this.logger.log(`Call ${UsersController.name}.delete method`);
    try {
      this.logger.log(`Delete user request received with id=${id}`);

      const input = UsersMapper.mapDeleteUserIdToDeleteUserUseCaseInput(id);

      this.logger.log(`Mapped input for use case ${JSON.stringify(input)}`);

      const result = await this.deleteUserUseCase.execute(input);

      if (result.isLeft()) {
        throw result.value;
      }

      this.logger.log(`User deleted successfully - ${id}`);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to delete user');
      this.logger.error(
        `Error deleting user: ${handledError.message} stack: ${handledError.stack}`,
      );
      throw handledError;
    }
  }
}
