import { Field, ArgsType } from '@nestjs/graphql';
import { ListArgs } from 'src/graphql/args/ListArgs';
import { UserRole } from '../userRole.enum';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetUsersArgs extends ListArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  contact?: string;

  @Field(() => UserRole, {
    nullable: true,
    // defaultValue: UserRole.user,
  })
  role?: UserRole;
}
