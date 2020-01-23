import { Document } from 'mongoose';
import IUser from './IUser';
import IComment from './IComment';

export default interface IPost extends Document {
  user: IUser['_id'];
  text: string;
  name: string;
  avatar: string;
  likes: IUser['_id'][],
  comments: IComment[],
  date: Date
}