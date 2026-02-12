import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDto } from '../../dto/create-user.request.dto';
import { CreateUserUseCase } from '../../../application/usecases/create-user/create-user.usecase';
import { CreateUserResponseDto } from '../../dto/create-user.response.dto';
import { UsersMapper } from '../../mappers/users.mapper';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  private readonly logger: Logger;

  constructor(private readonly createUserUseCase: CreateUserUseCase) {
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
}
