import * as actions from '../../types/actionTypes';
import { profileReducer } from '../profileReducer';
import { testUser } from '../__mocks__/user';
import { initialProfileState } from '../__mocks__/initialProfileState';


describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };
    const initialState = initialProfileState

    expect(profileReducer(undefined, action)).toEqual(initialState);
  });
});

describe('PROFILE_LOADING', () => {
  test('returns the correct state', () => {
    const action = { type: actions.PROFILE_LOADING, payload: null };
    const expectedState = {
      ...initialProfileState,
      loading: true
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_PROFILE', () => {
  test('returns the correct state', () => {
    const action = { type: actions.GET_PROFILE, payload: [testUser] };
    const expectedState = {
      ...initialProfileState,
      profile: [testUser]
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_PROFILES', () => {
  test('returns the correct state', () => {
    const action = { type: actions.GET_PROFILES, payload: [testUser] };
    const expectedState = {
      ...initialProfileState,
      profiles: [testUser]
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('CLEAR_CURRENT_PROFILE', () => {
  test('returns the correct state', () => {
    const action = { type: actions.CLEAR_CURRENT_PROFILE, payload: null };
    const expectedState = initialProfileState;

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});