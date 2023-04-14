import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericException extends HttpException {
  constructor(
    message = 'Opps! Something went wrong',
    description = 'Please check your network!',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, { description });
  }
}
