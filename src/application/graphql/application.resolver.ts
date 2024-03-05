import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { ApplicationService } from '../application.service';
import { Application } from './application.entity';
import { CreateOneApplicationArgs } from './args/CreateOneApplicationArgs';
import { UpdateOneApplicationArgs } from './args/UpdateOneApplicationArgs';
import { UniqueArgs } from 'src/graphql/args/UniqueArgs';
import { SuccessOutput } from 'src/graphql/dto/SuccessOutput';
import {
  GetApplicationsArgs,
  GetApplicationsByDateArgs,
  GetApplicationsHystoryArgs,
} from './args/GetApplicationsArgs';
import { ForbiddenException } from '@nestjs/common';
import { ApplicationStatus } from './application.enum';
import { UserRole } from 'src/user/graphql/userRole.enum';
import { ApplicationType } from './application.type';

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private applicationService: ApplicationService) {}

  @Query(() => ApplicationType, { nullable: true })
  async findOneApplication(@Args() args: UniqueArgs): Promise<Application> {
    const application = await this.applicationService.findById(args.id);
    return application;
  }

  @Query(() => [Application], { nullable: true })
  async findApplicationsByDate(
    @Args() args: GetApplicationsByDateArgs,
  ): Promise<Application[]> {
    return await this.applicationService.findByDateAndHours(args.date);
  }

  @Query(() => [Application], { nullable: true })
  async findApplications(
    @Args() args: GetApplicationsArgs,
  ): Promise<Application[]> {
    return await this.applicationService.find(args);
  }

  @Query(() => [Application], { nullable: true })
  async findApplicationsHistory(
    @Args() args: GetApplicationsHystoryArgs,
  ): Promise<Application[]> {
    return await this.applicationService.getApplicationHistory(args.email);
  }

  @Query(() => [Application], { nullable: true })
  async getApplicationsHistory(
    @Context() context: any,
  ): Promise<Application[]> {
    return await this.applicationService.getApplicationHistory(
      context.req.user.email,
    );
  }

  // @Mutation(() => SuccessOutput)
  // async deleteMyOneApplication(
  //   @Args() args: UniqueArgs,
  //   @Context() context: any,
  // ): Promise<SuccessOutput> {
  //   const application = await this.applicationService.findById(args.id);
  //   if (application.user && application.user.email === context.req.user.email) {
  //     const result = await this.applicationService.delete(args.id);
  //     return { success: result.affected === 1 ? true : false };
  //   } else {
  //     throw new UnauthorizedException();
  //   }
  // }

  @Mutation(() => SuccessOutput)
  async updateMyOneApplication(
    @Args() args: UpdateOneApplicationArgs,
    @Context() context: any,
  ): Promise<SuccessOutput> {
    const application = await this.applicationService.findById(args.id);
    if (application.user && application.user.email === context.req.user.email) {
      if (args.status === ApplicationStatus.APPROVED) {
        throw new ForbiddenException();
      }
      const result = await this.applicationService.update({
        ...args,
      });
      return { success: result.affected === 1 ? true : false };
    } else {
      throw new ForbiddenException();
    }
  }

  @Mutation(() => Application, { nullable: true })
  async createOneApplication(
    @Args() args: CreateOneApplicationArgs,
    @Context() context: any,
  ): Promise<Application | null> {
    if (
      context.user === UserRole.user &&
      args.status &&
      args.status !== ApplicationStatus.PENDING
    ) {
      return null;
    }
    const { date_from, date_to } = this.applicationService.getRange(args.date);
    const isOrderdPlace = await this.applicationService.find({
      date_from,
      date_to,
      place: args.place,
      status: ApplicationStatus.APPROVED,
    });
    if (isOrderdPlace.length) {
      console.error('Create Validation Error Table already booked ', {
        error: true,
        message: 'This place booked at this time',
        status: 412,
      });
      return null;
    }
    return await this.applicationService.create(args);
  }

  @Mutation(() => SuccessOutput)
  async deleteOneApplication(@Args() args: UniqueArgs): Promise<SuccessOutput> {
    const result = await this.applicationService.delete(args.id);
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => SuccessOutput)
  async updateOneApplication(
    @Args() args: UpdateOneApplicationArgs,
  ): Promise<SuccessOutput> {
    const result = await this.applicationService.update(args);
    return { success: result.affected === 1 ? true : false };
  }
}
