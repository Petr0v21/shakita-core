import { registerEnumType } from '@nestjs/graphql';

export enum BonusValueType {
  POINT,
  PERCENT,
}

registerEnumType(BonusValueType, {
  name: 'BonusValueType',
});

export enum BonusLevelType {
  JUNIOR,
  MIDDLE,
  SENIOR,
}

registerEnumType(BonusLevelType, {
  name: 'BonusLevelType',
});
