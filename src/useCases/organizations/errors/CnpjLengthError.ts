export class CnpjLengthError extends Error {
  constructor() {
    super('CNPJ length must be 14 characters.')
  }
}
