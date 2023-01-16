import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/mongoDb/schema';
import { DatabaseNames } from 'src/utils/common';
import { authController } from './auth.controller';
import { authServices } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DatabaseNames.USERS, schema: userSchema },
    ]),
  ],
  controllers: [authController],
  providers: [authServices],
})
export class authModule {}
