import { IsString } from 'class-validator';

export class pageNoDto {
  @IsString()
  page: string;
}
