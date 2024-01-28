import { Field, ArgsType } from '@nestjs/graphql';
import { ListArgs } from 'src/graphql/args/ListArgs';
import { IsOptional, IsUUID } from 'class-validator';
import { BonusLevelType, BonusValueType } from '../bonusValueType.enum';

@ArgsType()
export class GetBonusArgs extends ListArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  id?: string;

  @IsOptional()
  @Field(() => BonusValueType, { nullable: true })
  valueType?: BonusValueType;

  @IsOptional()
  @Field(() => BonusLevelType, { nullable: true })
  level?: BonusLevelType;

  @IsOptional()
  @Field({ nullable: true })
  isActive: boolean;

  @IsOptional()
  @Field({ nullable: true })
  asset?: string;
}
