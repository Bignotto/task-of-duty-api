export class PasswordLengthError extends Error {
  constructor() {
    super("Password should be 6 characters at least.");
  }
}
