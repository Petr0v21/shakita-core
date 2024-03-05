import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtGuard } from './guard/jwt.guard';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { SelectionNode, parse, visit } from 'graphql';
import { User } from 'src/user/graphql/user.entity';
import { UserRole } from 'src/user/graphql/userRole.enum';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtGuard: JwtGuard) {}
  private userMethods: string[] = [
    'getMe',
    'updateMe',
    'updateMyOneApplication',
    'getApplicationsHistory',
    'createBonusTicket',
    'findOneBonus',
  ];
  private managerMethods: string[] = [
    'findOneApplication',
    'findApplications',
    'findApplicationsHistory',
    'updateOneApplication',
    'updateOneUser',
    'createOneUser',
    'findOneUser',
    'findUsers',
    'getActualData',
    'getAllData',
    'getCorrelationApplicationsData',
    'getHistoryData',
    'createBonus',
    'updateBonus',
    'deleteBonus',
    'deleteBonusTicket',
    'activateBonus',
    'findBonus',
    'getTicket',
  ];
  private analytMethods: string[] = [
    'findOneApplication',
    'getApplicationsHistory',
    'findApplications',
    'findOneUser',
    'findUsers',
  ];
  private adminMethods: string[] = ['deleteOneApplication', 'deleteOneUser'];
  private publicMethods: string[] = [
    'login',
    'register',
    'refresh',
    'authGoogle',
    'createOneApplication',
    'findApplicationsByDate',
    'getCode',
    'checkCode',
    'resetPasswordCode',
  ];
  private supportMethods: string[] = ['__schema'];

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body?.query) {
      const ast = parse(req.body.query);

      let methodName: string | undefined;

      visit(ast, {
        OperationDefinition(node) {
          methodName = (
            node.selectionSet.selections[0] as SelectionNode & {
              name: { value: string };
            }
          ).name.value;
        },
      });

      if (!methodName) {
        throw new BadRequestException();
      }

      if (
        this.publicMethods.includes(methodName) ||
        this.supportMethods.includes(methodName)
      ) {
        return next();
      }

      const context = new ExecutionContextHost([req, res, next]);

      await this.jwtGuard.canActivate(context);
      const { role } = (req as any).user as User;

      switch (role) {
        case UserRole.blocked: {
          throw new ForbiddenException();
        }
        case UserRole.user: {
          if (this.userMethods.includes(methodName)) {
            return next();
          }
          throw new ForbiddenException();
        }
        case UserRole.manager: {
          if (
            this.userMethods.concat(this.managerMethods).includes(methodName)
          ) {
            return next();
          }
          throw new ForbiddenException();
        }
        case UserRole.analyt: {
          if (this.analytMethods.includes(methodName)) {
            return next();
          }
          throw new ForbiddenException();
        }
        case UserRole.super_manager: {
          if (this.managerMethods.includes(methodName)) {
            return next();
          }
          throw new ForbiddenException();
        }
        case UserRole.admin: {
          if (
            this.userMethods
              .concat(this.managerMethods, this.adminMethods)
              .includes(methodName)
          ) {
            return next();
          }
          throw new ForbiddenException();
        }
        default: {
          throw new BadRequestException();
        }
      }
    }

    if (req.baseUrl === '/file/upload' || req.baseUrl === '/file/delete') {
      const context = new ExecutionContextHost([req, res, next]);
      await this.jwtGuard.canActivate(context);
      const request = context.switchToHttp().getRequest();
      const { role } = request.user as User;
      if (req.baseUrl === '/file/delete' && role === UserRole.user) {
        throw new ForbiddenException();
      }
      return next();
    }

    return next();
  }
}
