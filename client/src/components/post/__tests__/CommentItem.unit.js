import { CommentItem } from '../CommentItem';
import { mockPosts } from '../../../__mocks__/mockPosts';
import { mockAuth } from '../../../__mocks__/mockAuth';

const deleteComment = jest.fn();
const { _id, comments } = mockPosts[0];
const { auth } = mockAuth;
const i = 0;
const propsWithCommentMatchingAuthUser = {
  postId: _id,
  comment: comments[0],
  deleteComment,
  auth,
  i
};
const propsWithCommentNotMatchingAuthUser = {
  ...propsWithCommentMatchingAuthUser,
  comment: comments[1]
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<CommentItem {...propsWithCommentMatchingAuthUser} />);
});

describe('<CommentItem />', () => {
  it(`shallows renders CommentItem, and when user who commented matches the authenticated user,
    then it displays delete button`, () => {
      const deleteBtnModalToggle = wrapper.find('button.posts-comments-feed__delete-item-button');
      
      expect(deleteBtnModalToggle.length).toEqual(1);
  });

  it(`shallows renders CommentItem, and when user who commented matches is not the authenticated user,
    then it does not display delete button`, () => {
      const wrapper = shallow(<CommentItem {...propsWithCommentNotMatchingAuthUser} />);
      const deleteBtnModalToggle = wrapper.find('button.posts-comments-feed__delete-item-button');
      
      expect(deleteBtnModalToggle.length).toEqual(0);
  });
});