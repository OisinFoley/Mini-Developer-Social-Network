import { mockPosts, newPost, deletedPostId } from './mockPosts';
import { fakeUser } from './mockAuth';

export default {
  get: jest.fn((url, id) => {
    switch (url) {
      case '/api/posts': // getPosts()
        return Promise.resolve({ data: mockPosts } );
        break;
      case '/api/posts/abc123': // getPost()
        return Promise.resolve({ data: mockPosts[0] } );
        break;
      // just setting up the switch cases, need to uncomment and add in the payload next time you open this solution
      case '/api/profile': // getCurrentProfile()
        // return Promise.resolve({ data: mockPosts[0] } );
        break;
      case '/api/profile/all': // getProfiles()
        // return Promise.resolve({ data: mockPosts[0] } );
        break;
      case '/api/profile/handle/${handle}': // getProfileByHandle()
        // return Promise.resolve({ data: mockPosts[0] } );
        break;
        
        
        
      default:
        break;
    }
  }),
  post: jest.fn((url, requestData) => {
    switch (url) {
      case '/api/posts': // addPost()
        return Promise.resolve({ data: newPost } );
        break;
      case '/api/posts/like/def456': // addLike()
        return Promise.resolve({ data: mockPosts } );
        break;
      case '/api/posts/unlike/def456': // deleteLike()
        return Promise.resolve({ data: mockPosts } );
        break;
      case '/api/posts/comment/def456': // addComment()
        return Promise.resolve({ data: mockPosts[0] } );
        break;
      case '/api/users/register': // registerUser()
        console.log(url);
        return Promise.resolve({ data: 'fakeUser' } );
        break;
      case '/api/users/login': // loginUser()
        return Promise.resolve({ data: fakeUser } );
        break;
      case '/api/profile': // createProfile()
        // return Promise.resolve({ data: fakeUser } );
        break;
      case '/api/profile/education': // addEducation()
        // return Promise.resolve({ data: fakeUser } );
        break;
      case '/api/profile/experience': // addExperience()
        // return Promise.resolve({ data: fakeUser } );
        break;
      default:
        break;
    }
  }),
  delete: jest.fn((url) => {
    console.log(url);
    switch (url) {
      case '/api/posts/ghi789': // deletePost()
        return Promise.resolve({ data: deletedPostId[0] } );
        break;
      case '/api/posts/comment/def456/pqr789': // deleteComment()
        return Promise.resolve({ data: deletedPostId[0] } );
        break;
      case '/api/profile/education/${id}': // deleteEducation()
        // return Promise.resolve({ data: deletedPostId[0] } );
        break;
      case '/api/profile/experience/${id}': // deleteExperience()
        // return Promise.resolve({ data: deletedPostId[0] } );
        break;
      case '/api/profile': // deleteAccount()
        // return Promise.resolve({ data: deletedPostId[0] } );
        break;
        
      default:
        break;
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