export default interface IComment {
  id: string;
  user: string;
  name: string;
  text: string;
  avatar?: string;
  date?: Date;
}