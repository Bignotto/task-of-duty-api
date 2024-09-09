export class CnpjAlreadyInUseError extends Error {
  constructor() {
    super('CNPJ already in use.')
  }
}
