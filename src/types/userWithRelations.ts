import { User } from '@prisma/client';
import { Result } from '@prisma/client';
import { UserAllergy } from '@prisma/client';
import { AllergyTypes } from '@prisma/client';

export type UserWithRelations = User & {
  UserAllergy: (UserAllergy & { allergy: AllergyTypes })[];
  Result: Result[];
};
