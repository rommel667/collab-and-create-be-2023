import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from '@nestjs/apollo';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtTokenService: JwtService,
  ) {}

  async register(input: CreateUserInput) {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (isUser) {
        throw new Error('Email already exists');
      } else {
        input.password = await bcrypt.hash(input.password, 10).then((r) => r);
        const result = await this.prisma.user.create({ data: input });
        if (result) {
          return 'Successfully registered';
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const match = await this.validateUser(password, user.password);
      if (match) {
        return this.generateUserCredentials(user);
      } else {
        throw new AuthenticationError('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      throw new AuthenticationError(err);
    }
  }

  async validateUser(password: string, hashedPassword: string): Promise<any> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateUserCredentials(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      name: user.name,
    };
    return this.jwtTokenService.sign(payload);
  }
}
