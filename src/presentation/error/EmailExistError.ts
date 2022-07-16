export class EmailExistError extends Error {
  constructor () {
    super('Email already in use')
    this.name = 'EmailExistError'
  }
}
