import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/IUser';

let UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model<IUser>('user', UserSchema);