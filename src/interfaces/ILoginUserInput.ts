import IUser from "./IUser";

export default interface ILoginUserInput {
  email: IUser['email'];
  password: IUser['password'];
}