import React, { Component } from 'react';

import CommentItem from './CommentItem';
import { Comment} from 'devconnector-types/interfaces';

interface StateProps {
  comments: Comment[];
  postId: string;
}

type Props = StateProps;

export class CommentFeed extends Component<Props> {
  render() {
    const { comments, postId } = this.props;

    return comments.map((comment: Comment, i: number) => (
      <CommentItem key={comment._id} i={i} comment={comment} postId={postId} />
    ));
  }
}

export default CommentFeed;
