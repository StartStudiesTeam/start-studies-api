import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
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

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  private readonly logger: Logger;

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly fetchUserUseCase: FetchUserUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
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
}
