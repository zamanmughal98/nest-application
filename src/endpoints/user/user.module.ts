import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/schemas/user.schema';
import { DatabaseNames } from 'src/utils/common';
import { userController } from './user.controller';
import { userServices } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: DatabaseNames.USERS, schema: userSchema },
    ]),
  ],
  controllers: [userController],
  providers: [userServices],
  exports: [userServices],
})
export class userModule {}
