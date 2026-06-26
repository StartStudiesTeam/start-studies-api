import { RoadmapStatusEnum } from '../enums/roadmap-status.enum';

export class SearchRoadmapUserResult {
  id: string;
  name: string;
  nickname: string;
}

export class SearchRoadmapResultItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatusEnum;
  createdAt: Date;
  updatedAt: Date | null;
  user: SearchRoadmapUserResult;
}

export class PaginatedRoadmapsResult {
  total: number;
  roadmaps: SearchRoadmapResultItem[];
}
