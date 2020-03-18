import mongoose, { Schema } from 'mongoose';

import { PostModel } from 'devconnector-types/interfaces';

const PostSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  comments: { 
    type: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }],
    default: []
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model<PostModel>('Post', PostSchema);