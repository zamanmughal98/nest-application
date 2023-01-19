export class validationErrorDto {
  value?: string;
  msg: string;
  param: string;
  location?: string;
}

export class messageDto {
  message?: string;
}

export class validationMessageDto extends messageDto {
  ValidationError?: IValidationError[];
}
