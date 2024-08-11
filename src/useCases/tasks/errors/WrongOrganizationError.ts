export class WrongOrganizationError extends Error {
  constructor() {
    super("Organization different from the task organization ");
  }
}
