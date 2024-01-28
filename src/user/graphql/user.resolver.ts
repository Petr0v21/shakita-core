import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from '../user.service';
import { User } from './user.entity';
import { UserType } from './user.type';
import { CreateOneUserArgs } from './args/CreateOneUserArgs';
import { UpdateOneUserArgs } from './args/UpdateOneUserArgs';
import { GetUsersArgs } from './args/GetUsersArgs';
import { UniqueArgs } from 'src/graphql/args/UniqueArgs';
import { SuccessOutput } from 'src/graphql/dto/SuccessOutput';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from './userRole.enum';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserType, { nullable: true })
  async findOneUser(@Args() args: UniqueArgs): Promise<User> {
    const user = await this.userService.findById(args.id);
    return user;
  }

  @Query(() => [User], { nullable: true })
  async findUsers(@Args() args: GetUsersArgs): Promise<User[]> {
    return await this.userService.find(args);
  }

  @Query(() => UserType)
  async getMe(@Context() context: any): Promise<User> {
    try {
      if (context.req.user.id) {
        const result = await this.userService.findById(context.req.user.id);
        return result;
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => User)
  async createOneUser(@Args() args: CreateOneUserArgs): Promise<User> {
    const user = await this.userService.create(args);
    return user;
  }

  @Mutation(() => SuccessOutput)
  async deleteOneUser(@Args() args: UniqueArgs): Promise<SuccessOutput> {
    const result = await this.userService.update(args.id, {
      role: UserRole.blocked,
    });
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => SuccessOutput)
  async updateOneUser(@Args() args: UpdateOneUserArgs): Promise<SuccessOutput> {
    const { id, ...body } = args;
    const result = await this.userService.update(id, body);
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => SuccessOutput)
  async updateMe(
    @Args() args: UpdateOneUserArgs,
    @Context() context: any,
  ): Promise<SuccessOutput> {
    const { id, ...body } = args;
    if (id === context.req.user.id) {
      const result = await this.userService.update(id, body);
      return { success: result.affected === 1 ? true : false };
    } else {
      throw new UnauthorizedException();
    }
  }
}
