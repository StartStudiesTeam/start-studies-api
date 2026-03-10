import { Roadmap } from '../roadmap';

export abstract class RoadmapRepository {
  abstract create(roadmap: Roadmap): Promise<Roadmap>;
}
