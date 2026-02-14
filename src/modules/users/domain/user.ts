import { Entity } from '@/src/common/entity/entity';
import { Either, left, right } from '@/src/common/errors/either';
import { Optional } from '@/src/common/types/optional';
import { InvalidUserError } from './errors/invalid-user-error';

export interface UserProps {
  name: string;
  email: string;
  nickname: string;
  password: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  phone?: string | null;
  status?: string | null;
  userType: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(
    props: Optional<
      UserProps,
      'dateOfBirth' | 'gender' | 'phone' | 'status' | 'createdAt' | 'updatedAt'
    >,
    id?: string,
  ): Either<InvalidUserError, User> {
    if (!props.name || props.name.trim().length < 4) {
      return left(
        new InvalidUserError('O nome deve ter no mínimo 4 caracteres.'),
      );
    }

    if (!User.isValidEmail(props.email)) {
      return left(new InvalidUserError('O e-mail informado é inválido.'));
    }

    const userProps: UserProps = {
      ...props,
      dateOfBirth: props.dateOfBirth ?? null,
      gender: props.gender ?? null,
      phone: props.phone ?? null,
      status: props.status ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    };

    const user = new User(userProps, id);
    return right(user);
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get nickname() {
    return this.props.nickname;
  }

  set nickname(nickname: string) {
    this.props.nickname = nickname;
    this.touch();
  }

  get dateOfBirth(): string | null {
    return this.props.dateOfBirth ?? null;
  }

  set dateOfBirth(dateOfBirth: string | null) {
    this.props.dateOfBirth = dateOfBirth;
    this.touch();
  }

  get gender(): string | null {
    return this.props.gender ?? null;
  }

  set gender(gender: string | null) {
    this.props.gender = gender;
    this.touch();
  }

  get phone(): string | null {
    return this.props.phone ?? null;
  }

  set phone(phone: string | null) {
    this.props.phone = phone;
    this.touch();
  }

  get status(): string | null {
    return this.props.status ?? null;
  }

  set status(status: string | null) {
    this.props.status = status;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get userType() {
    return this.props.userType;
  }

  set userType(userType: string) {
    this.props.userType = userType;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
