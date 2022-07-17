export class EmailExistError extends Error {
  constructor () {
    super('Email already in exist')
    this.name = 'EmailExistError'
  }
}
