import { 
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE } from '../../actions/types';
import profileReducer from '../profileReducer';

const testUser = {
  user: 'testUser1'
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' };
    const initialState = { 
      profile: null,
      profiles: null,
      loading: false
    };

    expect(profileReducer(undefined, action)).toEqual(initialState);
  });
});

describe('PROFILE_LOADING', () => {
  test('returns the correct state', () => {
    const action = { type: PROFILE_LOADING, payload: null };
    const expectedState = {
      profile: null,
      profiles: null,
      loading: true
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_PROFILE', () => {
  test('returns the correct state', () => {
    const action = { type: GET_PROFILE, payload: [testUser] };
    const expectedState = {
      profile: [testUser],
      profiles: null,
      loading: false
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('GET_PROFILES', () => {
  test('returns the correct state', () => {
    const action = { type: GET_PROFILES, payload: [testUser] };
    const expectedState = {
      profile: null,
      profiles: [testUser],
      loading: false
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});

describe('CLEAR_CURRENT_PROFILE', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_CURRENT_PROFILE, payload: null };
    const expectedState = {
      profile: null,
      profiles: null,
      loading: false
     };

    expect(profileReducer(undefined, action)).toEqual(expectedState);
  });
});