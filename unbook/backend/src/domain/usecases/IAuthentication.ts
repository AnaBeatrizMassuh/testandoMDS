interface IAuthenticationModel {
  email: string;
  password: string;
}
interface IAuthentication {
  auth(authentication: IAuthenticationModel): Promise<string>;
}

export { IAuthentication, IAuthenticationModel };
