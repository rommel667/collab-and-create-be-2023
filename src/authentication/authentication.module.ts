import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthenticationResolver } from './authentication.resolver';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    PrismaModule,
  ],
  providers: [
    AuthenticationService,
    AuthenticationResolver,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthenticationService, JwtStrategy, PassportModule, JwtAuthGuard],
})
export class AuthenticationModule {}
