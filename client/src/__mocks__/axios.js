import { mockPosts, newPost, deletedPostId } from './mockPosts';
import { fakeUser } from './mockAuth';
import { idCannotBeNullExceptionMessage } from './exceptionMessages';

export default {
  get: jest.fn((url, id) => {
    switch (url) {
      case '/api/posts': // getPosts()
        return Promise.resolve({ data: mockPosts } );
      case '/api/posts/abc123': // getPost()
        return Promise.resolve({ data: mockPosts[0] } );
      case '/api/posts/nonExistentPostId': // getPost()
        return Promise.reject({ data: null } );
      case '/api/profile': // getCurrentProfile()
        return Promise.resolve({ data: {} } );
      case '/api/profile/all': // getProfiles()
        return Promise.resolve({ data: ['profile1, profile2, profile3'] } );
      case '/api/profile/handle/user123': // getProfileByHandle()
        return Promise.resolve({ data: 'fakeProfile' } );
        
        
        
      default:
        break;
    }
  }),
  post: jest.fn((url, requestData, history) => {
    switch (url) {
      case '/api/posts': // addPost()
        return Promise.resolve({ data: newPost } );
      case '/api/posts/like/def456': // addLike()
        return Promise.resolve({ data: mockPosts } );
      case '/api/posts/unlike/def456': // deleteLike() resolve
        return Promise.resolve({ data: mockPosts } );
      case '/api/posts/unlike/null': // deleteLike() reject
        return Promise.reject({ response: { data: idCannotBeNullExceptionMessage } } );
      case '/api/posts/comment/def456': // addComment()
        return Promise.resolve({ data: mockPosts[0] } );
      case '/api/posts/comment/nonExistentPostId': // addComment()
        return Promise.reject({ response: { data: idCannotBeNullExceptionMessage } } );
      case '/api/users/register': // registerUser()
        return Promise.resolve({ data: 'fakeUser' } );
      case '/api/users/login': // loginUser()
        return Promise.resolve({ data: fakeUser } );
      case '/api/profile': // createProfile()
        return Promise.resolve({ data: fakeUser } );
      case '/api/profile/education': // addEducation()
        return Promise.resolve();
      case '/api/profile/experience': // addExperience()
        return Promise.resolve();
    }
  }),
  delete: jest.fn((url) => {
    console.log(url);
    switch (url) {
      case '/api/posts/ghi789': // deletePost()
        return Promise.resolve({ data: deletedPostId[0] } );
      case '/api/posts/comment/def456/pqr789': // deleteComment()
        return Promise.resolve({ data: deletedPostId[0] } );
      case '/api/profile/education/edu123': // deleteEducation()
        return Promise.resolve({ data: {} } );
      case '/api/profile/experience/exp123': // deleteExperience()
        return Promise.resolve({ data: {} } );
      case '/api/profile': // deleteAccount()
        return Promise.resolve({ data: {} } );
    }
  })

  // we want to use the above implementation once we update our action, reducer and component in the main code base
  //    need to ensure that the change to returning { success: true }  won't break the logic in the state that allows the view
  //    to know that it should remove the specific post from the local state's list once the deleteion is complete

  // delete: jest.fn((requestData) => Promise.resolve({ data: { id: deletedPostId[0] } }))
  // delete: jest.fn(() => {
  //   console.log(`hello ${deletedPostId[0]}`); Promise.resolve({ data: { id: deletedPostId[0] } })
  //   // console.log(`hello ${deletedPostId[0]}`); Promise.resolve({ data: deletedPostId[0] })
  // })
  // delete: jest.fn(() => Promise.resolve({ data: deletedPostId[0] }))
};