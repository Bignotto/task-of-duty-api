export class ExpiredInviteError extends Error {
  constructor() {
    super("Expired invite.");
  }
}
