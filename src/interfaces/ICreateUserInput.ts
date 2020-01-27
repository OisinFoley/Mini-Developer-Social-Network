import IUser from "./IUser";

export default interface ICreateUserInput {
  email: IUser['email'];
  name: IUser['name'];
  password: IUser['password'];
}