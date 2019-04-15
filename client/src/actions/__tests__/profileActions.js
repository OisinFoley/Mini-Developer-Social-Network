
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
