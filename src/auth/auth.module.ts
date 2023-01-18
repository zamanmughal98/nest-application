import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/mongoDb/schema';
import { DatabaseNames } from 'src/utils/common';
import env from 'src/utils/dotEnvConfig';
import { authController } from './auth.controller';
import { authServices } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [ 
    JwtModule.register({ secret: env.ACCESS_TOKEN_SECRET }),
    MongooseModule.forFeature([
      { name: DatabaseNames.USERS, schema: userSchema },
    ]),
  ],
  controllers: [authController],
  providers: [authServices, JwtStrategy],
})
export class authModule {}
