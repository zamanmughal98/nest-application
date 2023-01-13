import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/mongoDb/schema';
import { DatabaseNames } from 'src/utils/common';
import { userController } from './user.controller';
import { userServices } from './user.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DatabaseNames.USERS, schema: userSchema },
    ]),
  ],
  controllers: [userController],
  providers: [userServices],
})
export class userModule {}
