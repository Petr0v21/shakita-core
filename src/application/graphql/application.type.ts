import { Field, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/graphql/application.entity';
import { User } from 'src/user/graphql/user.entity';

@ObjectType()
export class ApplicationType extends Application {
  @Field(() => User, { nullable: true })
  user?: User;
}
