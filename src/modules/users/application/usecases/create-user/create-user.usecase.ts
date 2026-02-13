import { Injectable, Logger } from '@nestjs/common';
import { CreateUserUseCaseInput } from './dto/create-user.input.dto';
import { Either, left, right } from '@/src/common/errors/either';
import { CreateUserUseCaseOutput } from './dto/create-user.output.dto';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UsersMapper } from '../../../infra/mappers/users.mapper';
import { EmailAlreadyExistsError } from '../../../domain/errors/email-already-exists-error';
import { NicknameAlreadyExistsError } from '../../../domain/errors/nickaname-already-exists-error';
import { User } from '../../../domain/user';

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
        this.userRepository.findUniqueByEmail(input.email),
        this.userRepository.findByNickname(input.nickname),
      ]);

      if (userWithSameEmail) {
        return left(new EmailAlreadyExistsError());
      }

      if (userWithSameNickname) {
        return left(new NicknameAlreadyExistsError());
      }

      const createUser = User.create({
        ...input,
      });

      if (createUser.isLeft()) {
        return left(createUser.value);
      }

      const user = await this.userRepository.create(createUser.value);

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
