import { IEmailValidator } from "../presentation/protocols/IEmailValidator";

export class EmailValidatorAdapter implements IEmailValidator {

  isValid(email: string): boolean {
    return false

  }

}