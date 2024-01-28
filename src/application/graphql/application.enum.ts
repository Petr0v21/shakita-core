import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationStatus {
  REJECTED,
  PENDING,
  APPROVED,
}

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
});
