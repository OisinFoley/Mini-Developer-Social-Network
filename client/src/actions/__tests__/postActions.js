import mockAxios from 'axios';
// import mockAxios from '../../__mocks__/axios';

import {
  getPosts,
  addPost,
  deletePost,
  addLike,
  deleteLike,
  getPost,
  addComment,
  deleteComment
 } from '../postActions';

import * as actions from '../postActions'
import * as types from '../types';

import { mockStore } from '../../test/utils/mockStore';
import { mockPosts, newPost, deletedPostId } from '../../__mocks__/mockPosts';
import { idCannotBeNullExceptionMessage } from '../../__mocks__/exceptionMessages';


//  can this be put here and used repeatedly?? ---> const store = mockStore();

// test("returns undefined by default", () => {
//   const mock = jest.fn();

//   let result = mock("foo");

//   expect(result).toBeUndefined();
//   expect(mock).toHaveBeenCalled();
//   expect(mock).toHaveBeenCalledTimes(1);
//   expect(mock).toHaveBeenCalledWith("foo");
// });

// **** do we want to check status codes when we're finished??
// **** we need to mock sending the data, and test unhappy cases / responses (i.e. - error callback)
    // for unhappy cases: wrong payload or missing ids

describe('actions', () => {
  it('setPostLoading action object should be equal to expectedSetPostLoading object', () => {
    const expectedSetPostLoadingAction = {
      type: types.POST_LOADING
    }
    expect(actions.setPostLoading()).toEqual(expectedSetPostLoadingAction)
  });

  it('setPostLoading action object should be equal to expectedSetPostLoading object', () => {
    const expectedClearErrorsAction = {
      type: types.CLEAR_ERRORS
    }
    expect(actions.clearErrors()).toEqual(expectedClearErrorsAction)
  });
})

// is it possible to force the error state of this? try after the other actions are tested
describe("getPosts", () => {
  it(`changes state to POST_LOADING and after loading POSTS payload, 
    it then changes status to GET_POSTS`, async () => {
    const store = mockStore();
    await store.dispatch(getPosts());
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.POST_LOADING});
    expect(actions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });
});

// happy case, don't forget about sad case
describe("addPost", () => {
  it(`changes state to CLEAR_ERRORS and after adding a post, it changes to ADD_POST. 
    Its payload will be the newly added post`, async () => {
    const store = mockStore();
    await store.dispatch(addPost());
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.CLEAR_ERRORS});
    expect(actions[1]).toEqual({type: types.ADD_POST, payload: newPost });
  });
});


// this is the last mock that is not working -> other delete action working because it was actually a POST tounlike endpoint
describe("deletePost", () => {
//   // the payload should be updated later to be a { success: true } object
  it("changes state to DELETE_POST and payload is the id of the deleted post", async () => {
    const store = mockStore();

    mockAxios.delete.mockImplementationOnce(() =>
      Promise.resolve({
        data: deletedPostId[0]
      })
    );

    await store.dispatch(deletePost('deletedPostId'));
    const actions = store.getActions();
    // expect(actions[0]).toEqual({type: types.DELETE_POST, payload: deletedPostId });
    expect(actions[0]).toEqual({type: types.DELETE_POST, payload: 'deletedPostId' });
  });
});

describe("addLike", () => {
  it(`adds a 'like', 
    then dispatches getPosts() (and the 2 state changes that come with it of POST_LOADING & GET_POSTS). 
    finally, payload should include updated 'likes' list for the post that was acted upon`, async () => {
    const store = mockStore();
    await store.dispatch(addLike('def456'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.POST_LOADING});
    expect(actions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });

  it(`fails, 
    then dispatches GET_ERRORS  
    payload includes null id exception`, async () => {
    const store = mockStore();
    await store.dispatch(deleteLike(null));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("deleteLike", () => {
  it(`deletes a 'like', 
    then dispatches getPosts() (and the 2 state changes that come with it of POST_LOADING & GET_POSTS). 
    Payload should include updated 'likes' list for the post that was acted upon`, async () => {
      // update description if you dont strictly enforce having the updated like in your mocked response - see above test for more info
    const store = mockStore();
    await store.dispatch(deleteLike('def456'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.POST_LOADING});
    expect(actions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });

  it(`fails, 
    then dispatches GET_ERRORS  
    payload includes null id exception`, async () => {
    const store = mockStore();
    await store.dispatch(deleteLike(null));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("getPost", () => {
  it(`changes state to POST_LOADING and after loading POST payload, 
    it then changes status to GET_POST`, async () => {
    const store = mockStore();

    // var mock = new MockAdapter(mockAxios);
    // mock.onGet('/api/posts/abc123').reply(200, mockPosts[0]);


    await store.dispatch(getPost('abc123'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.POST_LOADING});
    expect(actions[1]).toEqual({type: types.GET_POST, payload: mockPosts[0] });
  });

  it(`fails, 
    then dispatches GET_POSTS,
    with empty payload`, async () => {
    const store = mockStore();
    await store.dispatch(getPost('nonExistentPostId'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.POST_LOADING });
    expect(actions[1]).toEqual({type: types.GET_POSTS, payload: null });
  });
});

describe("addComment", () => {
  it(`changes state to CLEAR_ERRORS and then after posting the comment it changes to GET_POST. 
    returned payload is updated post including newly added comment`, async () => {
    const store = mockStore();

    await store.dispatch(addComment('def456'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.CLEAR_ERRORS});
    expect(actions[1]).toEqual({type: types.GET_POST, payload: mockPosts[0] });
  });

  it(`fails, 
    then dispatches GET_POSTS,
    with empty payload`, async () => {
    const store = mockStore();
    await store.dispatch(addComment('nonExistentPostId'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({type: types.CLEAR_ERRORS });
    expect(actions[1]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("deleteComment", () => {
  it(`deletes specified comment for given post, then changes state to GET_POST. 
    returned payload is updated post reflecting removed comment`, async () => {
    const store = mockStore();

    await store.dispatch(deleteComment('def456', 'pqr789'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.GET_POST, payload: deletedPostId[0] });
  });
});