import mockAxios from 'axios';
import * as actions from '../postActions'
import * as types from '../types';
import { mockStore } from '../../__mocks__/mockStore';
import { mockPosts, newPost, deletedPostId } from '../../__mocks__/mockPosts';
import { idCannotBeNullExceptionMessage } from '../../__mocks__/exceptionMessages';

let store;
let storeActions;
beforeEach(() => {
  store = mockStore();
  storeActions = store.getActions();
});

describe('actions', () => {
  it('expects setPostLoading action object to equal types.POST_LOADING', () => {
    const expectedSetPostLoadingAction = {
      type: types.POST_LOADING
    }
    expect(actions.setPostLoading()).toEqual(expectedSetPostLoadingAction);
  });

  it('expects clearErrors action object to equal types.CLEAR_ERRORS', () => {
    const expectedClearErrorsAction = {
      type: types.CLEAR_ERRORS
    }
    expect(actions.clearErrors()).toEqual(expectedClearErrorsAction);
  });
})

describe("getPosts", () => {
  it(`dispatches POST_LOADING and when it resolves and returns POSTS payload, 
    then it dispatches GET_POSTS`, async () => {
    await store.dispatch(actions.getPosts());
    expect(storeActions[0]).toEqual({ type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({ type: types.GET_POSTS, payload: mockPosts });
  });
});

describe("addPost", () => {
  it(`dispatches CLEAR_ERRORS and after adding a post and resolving,
    then it dispatches ADD_POST,
    and returns payload with newly added post`, async () => {
    await store.dispatch(actions.addPost());
    expect(storeActions[0]).toEqual({ type: types.CLEAR_ERRORS});
    expect(storeActions[1]).toEqual({ type: types.ADD_POST, payload: newPost });
  });
});

describe("deletePost", () => {
  it("changes dispatches DELETE_POST and when resovled, then payload is id of the deleted post", async () => {
    mockAxios.delete.mockImplementationOnce(() =>
      Promise.resolve({
        data: deletedPostId[0]
      })
    );

    await store.dispatch(actions.deletePost('deletedPostId'));
    expect(storeActions[0]).toEqual({type: types.DELETE_POST, payload: 'deletedPostId' });
  });
});

describe("addLike", () => {
  it(`adds a 'like', and when resolved, then dispatches getPosts() action
    (and the actions and payloads that follow that dispatch - POST_LOADING, GET_POSTS).`, async () => {
    await store.dispatch(actions.addLike('def456'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });

  it(`fails, and when it does, then dispatches GET_ERRORS, including null id exception in payload`, async () => {
    await store.dispatch(actions.deleteLike(null));
    expect(storeActions[0]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("deleteLike", () => {
  it(`deletes a 'like', and when resolved, then dispatches getPosts() action
    (and the actions and payloads that follow that dispatch - POST_LOADING, GET_POSTS)`, async () => {
    await store.dispatch(actions.deleteLike('def456'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({type: types.GET_POSTS, payload: mockPosts });
  });

  it(`fails, and when it does, then dispatches GET_ERRORS, including null id exception in payload`, async () => {
    await store.dispatch(actions.deleteLike(null));
    expect(storeActions[0]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("getPost", () => {
  it(`dispatches POST_LOADING and when resolved, 
    then dispatches GET_POST, and returns POST payload`, async () => {
    await store.dispatch(actions.getPost('abc123'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING});
    expect(storeActions[1]).toEqual({type: types.GET_POST, payload: mockPosts[0] });
  });

  it(`fails, and when it does, then dispatches GET_POSTS, with empty payload`, async () => {
    await store.dispatch(actions.getPost('nonExistentPostId'));
    expect(storeActions[0]).toEqual({type: types.POST_LOADING });
    expect(storeActions[1]).toEqual({type: types.GET_POSTS, payload: null });
  });
});

describe("addComment", () => {
  it(`dispatches CLEAR_ERRORS and then after posting the comment it dispatches GET_POST. 
    returned payload is updated post including newly added comment`, async () => {
    await store.dispatch(actions.addComment('def456'));
    expect(storeActions[0]).toEqual({type: types.CLEAR_ERRORS});
    expect(storeActions[1]).toEqual({type: types.GET_POST, payload: mockPosts[0] });
  });

  it(`fails, then dispatches GET_POSTS, with empty payload`, async () => {
    await store.dispatch(actions.addComment('nonExistentPostId'));
    expect(storeActions[0]).toEqual({type: types.CLEAR_ERRORS });
    expect(storeActions[1]).toEqual({type: types.GET_ERRORS, payload: idCannotBeNullExceptionMessage });
  });
});

describe("deleteComment", () => {
  it(`deletes specified comment for given post, then dispatches GET_POST. 
    returned payload is updated post reflecting removed comment`, async () => {
    await store.dispatch(actions.deleteComment('def456', 'pqr789'));
    expect(storeActions[0]).toEqual({ type: types.GET_POST, payload: deletedPostId[0] });
  });
});