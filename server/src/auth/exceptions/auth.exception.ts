import { ApplicationException } from 'libs/shared/filters/application.exception';

export class NicknameAlreadyInUseException extends ApplicationException {
  getErrorCode(): string {
    return 'NICKNAME_ALREADY_IN_USE';
  }

  getHttpStatus(): number {
    return 400;
  }

  constructor(message: string) {
    super(message);
  }
}

export class UserNotFoundException extends ApplicationException {
  getErrorCode(): string {
    return 'USER_NOT_FOUND';
  }

  getHttpStatus(): number {
    return 404;
  }

  constructor(message: string) {
    super(message);
  }
}

export class InvalidPasswordException extends ApplicationException {
  getErrorCode(): string {
    return 'INVALID_PASSWORD';
  }

  getHttpStatus(): number {
    return 400;
  }

  constructor(message: string) {
    super(message);
  }
}
