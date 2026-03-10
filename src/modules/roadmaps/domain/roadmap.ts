import { Entity } from '@/src/common/entity/entity';
import { Either, left, right } from '@/src/common/errors/either';
import { Optional } from '@/src/common/types/optional';
import { RoadmapStatusEnum } from './enums/roadmap-status.enum';
import { RoadmapInvalidDataError } from './errors/roadmap-invalid-data-error';

export interface RoadmapProps {
  title: string;
  userId: string;
  description: string;
  status?: RoadmapStatusEnum | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Roadmap extends Entity<RoadmapProps> {
  constructor(props: RoadmapProps, id?: string) {
    super(props, id);
  }

  static create(
    props: Optional<
      RoadmapProps,
      'status' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id?: string,
  ): Either<RoadmapInvalidDataError, Roadmap> {
    if (!props.title || props.title.trim().length < 5) {
      return left(
        new RoadmapInvalidDataError(
          'O titulo deve ter no mínimo 5 caracteres.',
        ),
      );
    }

    if (props.title.trim().length > 50) {
      return left(
        new RoadmapInvalidDataError(
          'O titulo deve ter no máximo 50 caracteres.',
        ),
      );
    }

    if (!props.description || props.description.trim().length < 10) {
      return left(
        new RoadmapInvalidDataError(
          'A descrição deve ter no mínimo 10 caracteres.',
        ),
      );
    }

    if (props.description.trim().length > 100) {
      return left(
        new RoadmapInvalidDataError(
          'A descrição deve ter no máximo 100 caracteres.',
        ),
      );
    }

    const roadmapProps: RoadmapProps = {
      ...props,
      status: props.status ?? RoadmapStatusEnum.DRAFT,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      deletedAt: props.deletedAt ?? null,
    };

    const roadmap = new Roadmap(roadmapProps, id);
    return right(roadmap);
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get status() {
    return this.props.status ?? RoadmapStatusEnum.DRAFT;
  }

  set status(status: RoadmapStatusEnum) {
    this.props.status = status;
    this.touch();
  }

  get userId() {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  set deletedAt(deletedAt: Date | null) {
    this.props.deletedAt = deletedAt;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
