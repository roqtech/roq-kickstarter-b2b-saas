export class AuthorizationForbiddenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationForbiddenException";
  }
}