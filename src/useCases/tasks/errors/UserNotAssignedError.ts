export class UserNotAssignedError extends Error {
  constructor() {
    super('User not assigned.')
  }
}
