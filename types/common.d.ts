interface IValidationError {
  value?: string;
  msg: string;
  param: string;
  location?: string;
}
interface IValidationMessage extends IMessage {
  ValidationError?: IValidationError[];
}
interface IMessage {
  message?: string;
}
