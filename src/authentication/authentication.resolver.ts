import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@Resolver(() => User)
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => String, { nullable: true })
  register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authenticationService.register(createUserInput);
  }

  @Mutation(() => String)
  login(@Args('email') email: string, @Args('password') password: string) {
    const token = this.authenticationService.login({
      email,
      password,
    });
    return token;
  }
}
