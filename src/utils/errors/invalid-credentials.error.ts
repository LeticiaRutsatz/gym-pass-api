export class InvalidCredentials extends Error {
  constructor() {
    super('Invalid email or password!')
  }
}