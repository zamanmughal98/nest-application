import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/schemas/user.schema';
import { DatabaseNames } from 'src/utils/common';
import { jwtStrategy } from './guards/jwt.strategy';
import { authController } from './auth.controller';
import { authServices } from './auth.service';
import { userModule } from '../user/user.module';

@Module({
  imports: [
    userModule,
    ConfigModule.forRoot(),
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET }),
    MongooseModule.forFeature([
      { name: DatabaseNames.USERS, schema: userSchema },
    ]),
  ],
  controllers: [authController],
  providers: [authServices, jwtStrategy],
})
export class authModule {}
