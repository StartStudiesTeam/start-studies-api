import { Model } from '@/src/common/model/model';

export class SearchRoadmapUseCaseInput extends Model {
  filter?: string;
  limit?: number;
  offset?: number;

  constructor(obj: object) {
    super(obj);
  }
}
