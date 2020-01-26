export default interface IComment {
  _id: string;
  user: string;
  name: string;
  text: string;
  avatar?: string;
  date?: Date;
}