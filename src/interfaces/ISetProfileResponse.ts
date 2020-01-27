import IProfile from "./IProfile";

export default interface ISetProfileResponse {
  operation: 'edit' | 'create';
  profile: IProfile | null;
}