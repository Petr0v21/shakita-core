import { registerEnumType } from '@nestjs/graphql';

export enum BonusTicketType {
  CONST,
  DISPOSABLE,
}

registerEnumType(BonusTicketType, {
  name: 'BonusTicketType',
});
