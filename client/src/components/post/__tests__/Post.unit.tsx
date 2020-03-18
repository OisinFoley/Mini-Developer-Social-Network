import { Post } from '../Post';
import { mockPosts } from '../../../__mocks__/mockPosts';

const getPost = jest.fn();
const post = {
  post: mockPosts[0],
  loading: false
};
const mockHasPostState = {
  post,
  getPost,
  match: {
    params: {
      id: 'test_id'
    }
  }
};
const mockPostIsNullState = {
  ...mockHasPostState,
  post: { post: {}, loading: true }
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<Post {...mockHasPostState} />);
});
afterEach(() => {
  getPost.mockReset();
});

describe('<Post />', () => {
  it(`shallows renders Post, and when post is provided and loading is false,
    then it displays PostItem, CommentForm and CommentFeed components once each`, () => {
      const postItemComponent = wrapper.find('Connect(PostItem)');
      const commentFormComponent = wrapper.find('Connect(CommentForm)');
      const commentFeedComponent = wrapper.find('CommentFeed');

      expect(postItemComponent.length).toEqual(1);
      expect(commentFormComponent.length).toEqual(1);
      expect(commentFeedComponent.length).toEqual(1);
  });

  it(`shallows renders Post, and when componentDidMount, then it calls getPost action`, () => {
      expect(getPost.mock.calls.length).toEqual(1);
  });

  it(`shallows renders Post, and when post is null and loading is true,
      then it does not display PostItem, CommentForm and CommentFeed or component`, () => {
        const wrapper = shallow(<Post {...mockPostIsNullState} />);
        const postItemComponent = wrapper.find('Connect(PostItem)');
        const commentFormComponent = wrapper.find('Connect(CommentForm)');
        const commentFeedComponent = wrapper.find('CommentFeed');

        expect(postItemComponent.length).toEqual(0);
        expect(commentFormComponent.length).toEqual(0);
        expect(commentFeedComponent.length).toEqual(0);
  });
});