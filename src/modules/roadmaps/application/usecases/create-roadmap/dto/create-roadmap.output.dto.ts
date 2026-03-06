import { Model } from '@/src/common/model/model';
import { RoadmapStatusEnum } from '@/src/modules/roadmaps/domain/enums/roadmap-status.enum';

export class CreateRoadmapUseCaseOutput extends Model {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: RoadmapStatusEnum;

  constructor(obj: object) {
    super(obj);
  }
}
