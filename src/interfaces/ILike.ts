import IUser from "./IUser";

export default interface ILike {
  user: IUser['_id'];
}