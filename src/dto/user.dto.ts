import { IsNotEmpty, IsString, Length } from 'class-validator';
import { SendResponse } from 'src/utils/common';

export class userIdDto {
  @Length(24, 24, { message: SendResponse.INVALID_ID_LENGTH })
  userId: string;
}

export class updateUserDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class deleteUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
