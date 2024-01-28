import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  user,
  manager,
  analyt,
  super_manager,
  admin,
  blocked,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
