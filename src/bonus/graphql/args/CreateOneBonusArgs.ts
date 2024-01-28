import { Field, ArgsType, PartialType } from '@nestjs/graphql';
import { BonusLevelType, BonusValueType } from '../bonusValueType.enum';
import GraphQLJSON from 'graphql-type-json';
import { IsUUID } from 'class-validator';

@ArgsType()
export class CreateOneBonusArgs {
  @Field()
  count: number;

  @Field()
  asset: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  condition?: number;

  @Field(() => BonusLevelType, { nullable: true })
  level?: BonusLevelType;

  @Field(() => BonusValueType)
  valueType: BonusValueType;

  @Field(() => GraphQLJSON, { nullable: true })
  payload?: any;

  @Field({ nullable: true })
  isActive: boolean;
}

@ArgsType()
export class UpdateOneBonusArgs extends PartialType(CreateOneBonusArgs) {
  @Field()
  @IsUUID()
  id: string;
}
