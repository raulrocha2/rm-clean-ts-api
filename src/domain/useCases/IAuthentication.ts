export interface IAuthenticationModel {
  email: string
  password: string
}

export interface IAuthentication {
  auth({ email, password }: IAuthenticationModel): Promise<string>;
}