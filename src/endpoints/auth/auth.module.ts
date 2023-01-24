import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/lib/mongoDBSchema';
import { DatabaseNames } from 'src/utils/common';
import { jwtStrategy } from '../../lib/jwt.strategy';
import { authController } from './auth.controller';
import { authServices } from './auth.service';

@Module({
  imports: [
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
