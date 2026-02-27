import { Model } from '@/src/common/model/model';

export class SearchUsersUseCaseInput extends Model {
  filter?: string;
  limit?: number;
  offset?: number;

  constructor(obj: object) {
    super(obj);
  }
}
