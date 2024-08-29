export class NotOrganizationAdminError extends Error {
  constructor() {
    super("Not organization admin.");
  }
}
