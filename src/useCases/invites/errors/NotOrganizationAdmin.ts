export class NotOrganizationAdminError extends Error {
  constructor() {
    super("User can't create invites without admin level.");
  }
}
