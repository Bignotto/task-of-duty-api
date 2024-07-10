export class EmailAlreadyInUse extends Error {
  constructor() {
    super("E-mail already in use.");
  }
}
