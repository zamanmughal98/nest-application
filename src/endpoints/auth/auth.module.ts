import { Module } from '@nestjs/common';
import { userModule } from '../user/user.module';
import { authController } from './auth.controller';
import { authServices } from './auth.service';

@Module({
  imports: [
    userModule,
  ],
  controllers: [authController],
  providers: [authServices],
})
export class authModule {}
