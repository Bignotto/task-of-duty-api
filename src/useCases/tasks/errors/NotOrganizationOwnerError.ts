interface AppErrorConfig {
  origin?: string;
  sub?: string;
}

export class NotOrganizationOwnerError extends Error {
  private origin: string | undefined;
  private sub: string | undefined;
  constructor({ origin, sub }: AppErrorConfig) {
    super("No data found");
    this.origin = origin;
    this.sub = sub;
  }
}
