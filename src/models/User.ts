import mongoose, { Schema } from 'mongoose';
import { UserModel } from 'devconnector-types/interfaces';

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

export default mongoose.model<UserModel>('user', UserSchema);