import { Model } from '@/src/common/model/model';

export class FetchUserUseCaseInput extends Model {
  id: string;

  constructor(obj: object) {
    super(obj);
  }
}
