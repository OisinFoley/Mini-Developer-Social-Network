import { CommentItem } from '../CommentItem';
import { mockPosts } from '../../../__mocks__/mockPosts';
import { mockAuth } from '../../../__mocks__/mockAuth';

const deleteComment = jest.fn();
const { _id, comments } = mockPosts[0];
const { auth } = mockAuth;
const i = 0;
const commentState = {
  deleteComment,
  postId: _id,
  comment: comments[0],
  auth,
  i
}

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <CommentItem {...commentState} />
  );
});

describe('<CommentItem />', () => {
  it(`mounts renders CommentItem, when delete button is pressed and confirmed,
      then deleteComment action is called`, () => {
        wrapper.find('button[data-target="#deleteCommentModal-1"]').simulate('click');
        let deleteCommentModal = wrapper.find('[modalTitle="Delete Comment"]');
        deleteCommentModal = deleteCommentModal.at(0);
        deleteCommentModal.find(`button[id="${_id}"]`).simulate('click');

        expect(deleteComment.mock.calls.length).toBe(1);
  });
});