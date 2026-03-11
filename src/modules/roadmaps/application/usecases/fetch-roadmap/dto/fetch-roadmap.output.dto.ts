import { Model } from '@/src/common/model/model';
import { RoadmapStatusEnum } from '@/src/modules/roadmaps/domain/enums/roadmap-status.enum';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';

export class FetchRoadmapUseCaseOutput extends Model {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: RoadmapStatusEnum;
  user: FetchRoadmapUserUseCaseOutput;
  createdAt: string;
  updatedAt: string;

  constructor(obj: object) {
    super(obj);
  }
}

export class FetchRoadmapUserUseCaseOutput {
  name: string;
  nickname: string;
  status: UserStatusEnum;
  userType: UserTypeEnum;
}
