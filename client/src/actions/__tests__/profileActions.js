
import mockAxios from 'axios';

import {
  getCurrentProfile,
  createProfile,
  addEducation,
  deleteEducation,
  addExperience,
  getProfiles,
  getProfileByHandle,
  deleteExperience,
  deleteAccount,
  setProfileLoading,
  clearCurrentProfile
 } from '../profileActions';
 
import * as actions from '../profileActions'
import * as types from '../types';

import { mockStore } from '../../test/utils/mockStore';

describe('getCurrentProfile', () => {
  it('should dispatch setProfileLoading, then dispatch GET_PROFILE', async () => {
    const store = mockStore();
    await store.dispatch(getCurrentProfile());
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.PROFILE_LOADING});
    expect(actions[1]).toEqual({ type: types.GET_PROFILE, payload: {} });
  })
})

describe('createProfile', () => {
  let mock;
  beforeEach(() => {
    mock = jest.spyOn(mockAxios, 'post');
  });
  afterEach(() => {
    mock.mockRestore();
  });
  it('should create profile then push /dashboard to history', async () => {
    const push = jest.fn();
    const history = { push };
    const dispatch = jest.fn();

    await actions.createProfile('the profile data', history)(dispatch);

    expect(mock).toHaveBeenCalledWith('/api/profile', 'the profile data');
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  })
})

describe('addEducation', () => {
  let mock;
  beforeEach(() => {
    mock = jest.spyOn(mockAxios, 'post');
  });
  afterEach(() => {
    mock.mockRestore();
  });
  it('should create education then push /dashboard to history', async () => {
    const push = jest.fn();
    const history = { push };
    const dispatch = jest.fn();

    await actions.addEducation('the education data', history)(dispatch);

    expect(mock).toHaveBeenCalledWith('/api/profile/education', 'the education data');
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  })
})

describe('deleteEducation', () => {
  it('should delete education then dispatch GET_PROFILE', async () => {
    const store = mockStore();
    await store.dispatch(deleteEducation('edu123'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.GET_PROFILE, payload: {}});
  })
})


describe('addExperience', () => {
  let mock;
  beforeEach(() => {
    mock = jest.spyOn(mockAxios, 'post');
  });
  afterEach(() => {
    mock.mockRestore();
  });
  it('should create education then push /dashboard to history', async () => {
    const push = jest.fn();
    const history = { push };
    const dispatch = jest.fn();

    await actions.addExperience('the experience data', history)(dispatch);

    expect(mock).toHaveBeenCalledWith('/api/profile/experience', 'the experience data');
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  })
})

describe('deleteExperience', () => {
  it('should delete experience then dispatch GET_PROFILE', async () => {
    const store = mockStore();
    await store.dispatch(deleteExperience('exp123'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.GET_PROFILE, payload: {}});
  })
})

describe('getProfiles', () => {
  it('should dispatch setProfileLoading then dispatch GET_PROFILES with data in the payload after successful callback from the endpoint', async () => {
    const store = mockStore();
    await store.dispatch(getProfiles());
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.PROFILE_LOADING });
    expect(actions[1]).toEqual({ type: types.GET_PROFILES, payload: ['profile1, profile2, profile3'] });
  })
})

describe('getProfileByHandle', () => {
  it('should dispatch setProfileLoading then dispatch GET_PROFILE with data in the payload after successful callback from the endpoint', async () => {
    const store = mockStore();
    await store.dispatch(getProfileByHandle('user123'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.PROFILE_LOADING });
    expect(actions[1]).toEqual({ type: types.GET_PROFILE, payload: 'fakeProfile' });
  })
})

describe('deleteAccount', () => {
  it('should dispatch SET_CURRENT_USER with empty payload after successful callback from the endpoint', async () => {
    const store = mockStore();
    await store.dispatch(deleteAccount());
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.SET_CURRENT_USER, payload: {} });
  })
})

describe('setProfileLoading', () => {
  it('should dispatch PROFILE_LOADING', async () => {
    const store = mockStore();
    await store.dispatch(setProfileLoading());
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.PROFILE_LOADING });
  })
})

describe('clearCurrentProfile', () => {
  it('should dispatch CLEAR_CURRENT_PROFILE', async () => {
    const store = mockStore();
    await store.dispatch(clearCurrentProfile());
    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: types.CLEAR_CURRENT_PROFILE });
  })
})