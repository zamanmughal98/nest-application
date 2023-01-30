import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { userModule } from '../user/user.module';
import { authController } from './auth.controller';
import { authServices } from './auth.service';
import { jwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    userModule,
    ConfigModule.forRoot(),
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET }),
  ],
  controllers: [authController],
  providers: [authServices, jwtStrategy],
})
export class authModule {}
