import mongoose from 'mongoose';
const { Schema } = mongoose;

let UserSchema = new Schema({
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

// TODO: export with type: mongoose.model<someType>('user', UserSchema);
export default mongoose.model('user', UserSchema);