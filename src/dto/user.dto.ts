import { IsNotEmpty, IsString } from 'class-validator';

export class userIdDto {
  @IsString() userId: string;
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
