import { SearchQuery } from '@/src/common/types/pagination/search-users-query.type';
import { Roadmap } from '../roadmap';
import { PaginatedRoadmapsResult } from '../types/paginated-roadmap-result.type';

export abstract class RoadmapRepository {
  abstract create(roadmap: Roadmap): Promise<Roadmap>;
  abstract findById(id: string): Promise<Roadmap | null>;
  abstract searchByFilters(
    query: SearchQuery,
  ): Promise<PaginatedRoadmapsResult>;
}
