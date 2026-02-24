import { Model } from '@/src/common/model/model';

export class DeleteUserUseCaseInput extends Model {
  id: string;

  constructor(obj: object) {
    super(obj);
  }
}
