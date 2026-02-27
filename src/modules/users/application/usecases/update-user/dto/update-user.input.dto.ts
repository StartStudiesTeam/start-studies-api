import { Model } from '@/src/common/model/model';
import { UserGenderEnum } from '@/src/modules/users/domain/enums/user-gender.enum';

export class UpdateUserUseCaseInput extends Model {
  id: string;
  name?: string;
  email?: string;
  nickname?: string;
  gender?: UserGenderEnum;
  phone?: string;

  constructor(obj: object) {
    super(obj);
  }
}
