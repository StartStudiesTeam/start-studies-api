import { SearchUsersInputType } from '../types/search-users.input.types';
import { SearchUsersOutputType } from '../types/search-users.output.type';
import { User } from '../user';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findUniqueByEmail(email: string): Promise<User | null>;
  abstract findByNickname(nickname: string): Promise<User | null>;
  abstract search(query: SearchUsersInputType): Promise<SearchUsersOutputType>;
}
