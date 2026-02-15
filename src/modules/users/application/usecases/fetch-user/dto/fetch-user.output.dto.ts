import { Model } from '@/src/common/model/model';
import { UserGenderEnum } from '@/src/modules/users/domain/enums/user-gender.enum';
import { UserStatusEnum } from '@/src/modules/users/domain/enums/user-status.enum';
import { UserTypeEnum } from '@/src/modules/users/domain/enums/user-type.enum';

export class FetchUserUseCaseOutput extends Model {
  id: string;
  name: string;
  email: string;
  nickname: string;
  dateOfBirth?: string;
  gender?: UserGenderEnum;
  phone?: string;
  status: UserStatusEnum;
  userType: UserTypeEnum;
  createdAt: string;
  updatedAt: string;

  constructor(obj: object) {
    super(obj);
  }
}
