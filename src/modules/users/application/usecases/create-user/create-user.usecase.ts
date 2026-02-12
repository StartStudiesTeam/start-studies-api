import { Injectable, Logger } from '@nestjs/common';
import { CreateUserUseCaseInput } from './dto/create-user.input.dto';
import { Either, left, right } from '@/src/common/errors/either';
import { CreateUserUseCaseOutput } from './dto/create-user.output.dto';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UsersMapper } from '../../../infra/mappers/users.mapper';

@Injectable()
export class CreateUserUseCase {
  private readonly logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(CreateUserUseCase.name);
  }

  async execute(
    input: CreateUserUseCaseInput,
  ): Promise<Either<Error, CreateUserUseCaseOutput>> {
    this.logger.log(`Call ${CreateUserUseCase.name}.execute method`);
    try {
      this.logger.log(
        `CreateUserUseCaseInput received: ${JSON.stringify(input)}`,
      );

      this.logger.log(
        `Checking existing users by email=${input.email} and nickname=${input.nickname}`,
      );

      const [userWithSameEmail, userWithSameNickname] = await Promise.all([
        this.userRepository.findByEmail(input.email),
        this.userRepository.findByNickname(input.nickname),
      ]);

      if (userWithSameEmail) {
        return left(new Error('Email already registered'));
      }

      if (userWithSameNickname) {
        return left(new Error('Nickname already registered'));
      }

      const user = await this.userRepository.create({
        ...input,
      });

      const output = UsersMapper.mapUserToCreateUserUseCaseOutput(user);
      return right(output);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to create user');
      this.logger.error(
        `Error creating user: ${handledError.message} stack: ${handledError.stack}`,
      );
      return left(handledError);
    }
  }
}
