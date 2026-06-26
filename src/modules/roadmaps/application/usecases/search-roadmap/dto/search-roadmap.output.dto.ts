import { Model } from '@/src/common/model/model';
import { RoadmapStatusEnum } from '@/src/modules/roadmaps/domain/enums/roadmap-status.enum';

export class SearchRoadmapOutputItem extends Model {
  id: string;
  title: string;
  description: string;
  user: SearchRoadmapUserOutputItem;
  status: RoadmapStatusEnum;
  createdAt: string;
  updatedAt: string;

  constructor(obj: object) {
    super(obj);
  }
}

export class SearchRoadmapUserOutputItem extends Model {
  id: string;
  name: string;
  nickname: string;

  constructor(obj: object) {
    super(obj);
  }
}

export class SearchRoadmapUseCaseOutput extends Model {
  total: number;
  data: SearchRoadmapOutputItem[];

  constructor(obj: object) {
    super(obj);
  }
}
