import { IsNotEmpty } from 'class-validator';

export class pageNoDto {
  @IsNotEmpty()
  page: string;
}
