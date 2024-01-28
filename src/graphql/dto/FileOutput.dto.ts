import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileOutput {
  @Field()
  Location: string;
  @Field()
  ETag: string;
  @Field()
  Bucket: string;
  @Field()
  Key: string;
}
