import { User } from '../user';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findUniqueByEmail(email: string): Promise<User | null>;
  abstract findByNickname(nickname: string): Promise<User | null>;
}
