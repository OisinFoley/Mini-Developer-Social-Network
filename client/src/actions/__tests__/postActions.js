import mockAxios from 'axios';

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


// fix formatting of code, test names for WHEN THEN, and describe blocks 

let store;
let storeActions;
beforeEach(() => {
  store = mockStore();
  storeActions = store.getActions();
});

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
    await store.dispatch(actions.getPosts());
    expect(storeActions[0]).toEqual({ type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({ type: types.GET_POSTS, payload: mockPosts });
  });
});

describe("addPost", () => {
  it(`changes state to CLEAR_ERRORS and after adding a post, it changes to ADD_POST. 
    Its payload will be the newly added post`, async () => {
    await store.dispatch(actions.addPost());
    expect(storeActions[0]).toEqual({ type: types.CLEAR_ERRORS});
    expect(storeActions[1]).toEqual({ type: types.ADD_POST, payload: newPost });
  });
});


describe("deletePost", () => {
  it("changes state to DELETE_POST and payload is the id of the deleted post", async () => {
    mockAxios.delete.mockImplementationOnce(() =>
      Promise.resolve({
        data: deletedPostId[0]
      })
    );

    await store.dispatch(deletePost('deletedPostId'));
    expect(storeActions[0]).toEqual({type: types.DELETE_POST, payload: 'deletedPostId' });
  });
});

describe("addLike", () => {
  it(`adds a 'like', 
    then dispatches getPosts() (and the 2 state changes that come with it of POST_LOADING & GET_POSTS). 
    Then, payload should include updated 'likes' list for the post that was operated upon`, async () => {
    await store.dispatch(addLike('def456'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });

  it(`fails, 
    then dispatches GET_ERRORS  
    payload includes null id exception`, async () => {
    await store.dispatch(deleteLike(null));
    expect(storeActions[0]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("deleteLike", () => {
  it(`deletes a 'like', 
    then dispatches getPosts() (and the 2 state changes that come with it of POST_LOADING & GET_POSTS). 
    Payload should include updated 'likes' list for the post that was acted upon`, async () => {
      // update description if you dont strictly enforce having the updated like in your mocked response - see above test for more info
    await store.dispatch(deleteLike('def456'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });

  it(`fails, 
    then dispatches GET_ERRORS  
    payload includes null id exception`, async () => {
    await store.dispatch(deleteLike(null));
    expect(storeActions[0]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("getPost", () => {
  it(`changes state to POST_LOADING and after loading POST payload, 
    it then changes status to GET_POST`, async () => {
    await store.dispatch(getPost('abc123'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({type: types.GET_POST, payload: mockPosts[0] });
  });

  it(`fails, 
    then dispatches GET_POSTS,
    with empty payload`, async () => {
    await store.dispatch(getPost('nonExistentPostId'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING });
    expect(storeActions[1]).toEqual({type: types.GET_POSTS, payload: null });
  });
});

describe("addComment", () => {
  it(`changes state to CLEAR_ERRORS and then after posting the comment it changes to GET_POST. 
    returned payload is updated post including newly added comment`, async () => {

    await store.dispatch(addComment('def456'));
    const actions = store.getActions();
    expect(storeActions[0]).toEqual({type: types.CLEAR_ERRORS});
    expect(storeActions[1]).toEqual({type: types.GET_POST, payload: mockPosts[0] });
  });

  it(`fails, 
    then dispatches GET_POSTS,
    with empty payload`, async () => {
    await store.dispatch(addComment('nonExistentPostId'));
    expect(storeActions[0]).toEqual({type: types.CLEAR_ERRORS });
    expect(storeActions[1]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("deleteComment", () => {
  it(`deletes specified comment for given post, then changes state to GET_POST. 
    returned payload is updated post reflecting removed comment`, async () => {
    await store.dispatch(deleteComment('def456', 'pqr789'));
    expect(storeActions[0]).toEqual({ type: types.GET_POST, payload: deletedPostId[0] });
  });
});