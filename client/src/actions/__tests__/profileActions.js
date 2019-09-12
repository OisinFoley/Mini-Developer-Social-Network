import mockAxios from 'axios';
import * as actions from '../profileActions'
import * as types from '../types';
import { mockStore } from '../../__mocks__/mockStore';

let store;
let storeActions;
let mock;
let push;
let history;
let dispatch;
beforeEach(() => {
  store = mockStore();
  storeActions = store.getActions();
});

describe('profileActions: mocking history', () => {
  
  beforeEach(() => {
    store = mockStore();
    storeActions = store.getActions();
    mock = jest.spyOn(mockAxios, 'post');
    push = jest.fn();
    history = { push };
    dispatch = jest.fn();
  });
  afterEach(() => {
    mock.mockRestore();
  });

  describe('createProfile', () => {
    it(`should create profile by calling '/api/profiles', then push /dashboard to history`, () => {
      actions.createProfile('the profile data', history)(dispatch)
        .then(() => {
          expect(mock).toHaveBeenCalledWith('/api/profiles', 'the profile data');
          expect(history.push).toHaveBeenCalledWith('/dashboard');
        });
    });
  });

  describe('addEducation', () => {
    it('should create education then push /dashboard to history', () => {
      actions.addEducation('the education data', history)(dispatch)
        .then(() => {
          expect(mock).toHaveBeenCalledWith('/api/profiles/educations', 'the education data');
          expect(history.push).toHaveBeenCalledWith('/dashboard');
        });
    });
  });

  describe('addExperience', () => {
    it('should create education then push /dashboard to history', () => {
      actions.addExperience('the experience data', history)(dispatch)
        .then(() => {
          expect(mock).toHaveBeenCalledWith('/api/profiles/experiences', 'the experience data');
          expect(history.push).toHaveBeenCalledWith('/dashboard');
        });
    });
  });

});

describe('getCurrentProfile', () => {
  it('dispatches setProfileLoading, then dispatches GET_PROFILE', () => {
    return store.dispatch(actions.getCurrentProfile())
      .then(() => {
        expect(storeActions[0]).toEqual({ type: types.PROFILE_LOADING});
        expect(storeActions[1]).toEqual({ type: types.GET_PROFILE, payload: {} });
      });
  });
});

describe('deleteEducation', () => {
  it('should delete education then dispatch GET_PROFILE', () => {
    return store.dispatch(actions.deleteEducation('edu123'))
      .then(() => {
        expect(storeActions[0]).toEqual({ type: types.GET_PROFILE, payload: {}});
      });
  });
});

describe('deleteExperience', () => {
  it('should delete experience then dispatch GET_PROFILE', () => {
    return store.dispatch(actions.deleteExperience('exp123'))
      .then(() => {
        expect(storeActions[0]).toEqual({ type: types.GET_PROFILE, payload: {}});
      });
  });
});

describe('getProfiles', () => {
  it('should dispatch setProfileLoading then dispatch GET_PROFILES with data in the payload after successful callback from the endpoint', () => {
    return store.dispatch(actions.getProfiles())
      .then(() => {
        expect(storeActions[0]).toEqual({ type: types.PROFILE_LOADING });
        expect(storeActions[1]).toEqual({ type: types.GET_PROFILES, payload: ['profile1, profile2, profile3'] });
      });
  });
});

describe('getProfileByHandle', () => {
  it('should dispatch setProfileLoading then dispatch GET_PROFILE with data in the payload after successful callback from the endpoint', () => {
    return store.dispatch(actions.getProfileByHandle('user123'))
      .then(() => {
        expect(storeActions[0]).toEqual({ type: types.PROFILE_LOADING });
        expect(storeActions[1]).toEqual({ type: types.GET_PROFILE, payload: 'fakeProfile' });
      });
  });
});

describe('deleteAccount', () => {
  it('should dispatch SET_CURRENT_USER with empty payload after successful callback from the endpoint', () => {
    return store.dispatch(actions.deleteAccount())
    .then(() => {
      expect(storeActions[0]).toEqual({ type: types.SET_CURRENT_USER, payload: {} });
    });
  });
});

describe('setProfileLoading', () => {
  it('should dispatch PROFILE_LOADING', () => {
    store.dispatch(actions.setProfileLoading());
    expect(storeActions[0]).toEqual({ type: types.PROFILE_LOADING });
  });
});

describe('clearCurrentProfile', () => {
  it('should dispatch CLEAR_CURRENT_PROFILE', () => {
    store.dispatch(actions.clearCurrentProfile());
    expect(storeActions[0]).toEqual({ type: types.CLEAR_CURRENT_PROFILE });
  });
});