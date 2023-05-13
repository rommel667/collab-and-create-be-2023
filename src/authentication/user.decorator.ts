import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user: User =
      GqlExecutionContext.create(context).getContext().req.user;
    console.log('USER', user);
    return user;
  },
);
