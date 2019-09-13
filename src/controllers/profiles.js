import ProfilesService from '../services/profiles';
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';
import errorMessages from '../utils/error-handling-strings';
import { parseRequestValuesToProfileFields } from '../utils/assignValuesToProps';

class ProfilesController {
  getCurrentUsersProfile(req, res, next) {
    const { id } = req.user
  
    ProfilesService.getByUserId(id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_current_user;
        }
        next(err);
      });
  };

  getAllProfiles(req, res, next) {
    ProfilesService.getAll()
      .then(profiles => res.json(profiles))
      .catch(err => next(err));
  };

  getProfileByHandle(req, res, next) {
    const { handle } = req.params;

    ProfilesService.getProfileByHandle(handle, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => next(err))
  };

  getProfileByUserId(req, res, next) {
    const { user_id } = req.params;

    ProfilesService.getByUserId(user_id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_user_id;
        }
        next(err);
      });
  };

  setUserProfile(req, res, next) {
    const { errors, isValid } = validateProfileInput(req.body, errorMessages);
    const { id } = req.user;
  
    if (!isValid) next(errors);

    const requestBody = {...req.body};

    // get fields
    let profileFields = {};
    profileFields.social = {};
    profileFields.user = req.user.id;

    parseRequestValuesToProfileFields(profileFields, requestBody);

    ProfilesService.setProfileForUser(id, profileFields, errorMessages)
      .then(data => {
        const { operation, profile } = data;
        
        if (operation === 'create') res.status(201).json(profile);
        if (operation === 'edit') res.json(profile);
      })
      .catch(err => next(err));
  };

  addExperienceToProfile(req, res, next) {
    const { errors, isValid } = validateExperienceInput(req.body, errorMessages);
    const { id } = req.user;
    const experienceData = {...req.body};

    if (!isValid) next(errors);
  
    ProfilesService.addExperience(id, experienceData, errorMessages)
      .then(profile => res.status(201).json(profile))
      .catch(err => next(err));
  };

  deleteExperienceFromProfileById(req, res, next) {
    const { exp_id } = req.params;
    const { id } = req.user;
    ProfilesService.deleteExperience(id, exp_id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => next(err));
  };

  addEducationToProfile(req, res, next) {
    const { errors, isValid } = validateEducationInput(req.body, errorMessages);
    const educationData = {...req.body};
    const { id } = req.user;

    if (!isValid) next(errors);

    ProfilesService.addEducation(id, educationData, errorMessages)
      .then(profile => res.status(201).json(profile))
      .catch(err => next(err));
  };

  deleteEducationFromProfileById(req, res, next) {
    const { edu_id } = req.params;
    const { id } = req.user;

    ProfilesService.deleteEducation(id, edu_id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => next(err));
  };

  deleteAccountForUser(req, res, next) {
    const { id } = req.user;
    ProfilesService.deleteProfileAndUser(id)
      .then(() => res.status(204).json());
  };
};
export default new ProfilesController();