interface AppErrorConfig {
  origin?: string
  sub?: string
}

export class NotFoundError extends Error {
  private origin: string | undefined
  private sub: string | undefined
  constructor({ origin, sub }: AppErrorConfig) {
    super('No data found')
    this.origin = origin
    this.sub = sub
  }
}
