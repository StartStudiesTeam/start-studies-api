import { Model } from '@/src/common/model/model';

export class FetchRoadmapUseCaseInput extends Model {
  id: string;

  constructor(obj: object) {
    super(obj);
  }
}
