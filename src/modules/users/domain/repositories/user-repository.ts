import { User } from '../user';

export type CreateUserRepositoryInput = Omit<User, 'id'>;

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByNickname(nickname: string): Promise<User | null>;
  abstract create(input: CreateUserRepositoryInput): Promise<User>;
}
