import ProfilesService from '../services/profiles';
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';
import errorMessages from '../error-handling/strings';

class ProfilesController {
  getCurrentUsersProfile(req, res) {
    const { id } = req.user
  
    ProfilesService.getByUserId(id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_current_user;
          res.status(404).json(err);
        }
      });
  };

  getAllProfiles(req, res) {
    ProfilesService.getAll()
      .then(profiles => res.json(profiles))
      .catch(err => {
        if (err.noProfiles) res.status(404).json(err);
      });
  };

  getProfileByHandle(req, res) {
    const { handle } = req.params;

    ProfilesService.getProfileByHandle(handle, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile) res.status(404).json(err);
      })
  };

  getProfileByUserId(req, res) {
    const { user_id } = req.params;

    ProfilesService.getByUserId(user_id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile) {
          err.noProfile = errorMessages.profile_not_found_for_user_id;
          res.status(404).json(err);
        }
      });
  };

  setUserProfile(req, res) {
    const { errors, isValid } = validateProfileInput(req.body);
    const { id } = req.user;
  
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
  
    //skills needs to be parsed to an array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
  
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    ProfilesService.setProfileForUser(id, profileFields, errorMessages)
      .then(data => {
        const { operation, profile } = data;
        
        if (operation === 'create') res.status(201).json(profile);
        if (operation === 'edit') res.json(profile);
      })
      .catch(err => {
        if (err.handle) res.status(400).json(err);
      });
  };

  addExperienceToProfile(req, res) {
    const { errors, isValid } = validateExperienceInput(req.body);
    const { id } = req.user;
    const experienceData = {...req.body};

    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    ProfilesService.addExperience(id, experienceData, errorMessages)
      .then(profile => res.status(201).json(profile))
      .catch(err => {
        if (err.noProfile) res.status(404).json(err);
      });
  };

  deleteExperienceFromProfileById(req, res) {
    const { exp_id } = req.params;
    const { id } = req.user;
    ProfilesService.deleteExperience(id, exp_id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile || err.experience_not_found)
          res.status(404).json(err)
      });
  };

  addEducationToProfile(req, res) {
    const { errors, isValid } = validateEducationInput(req.body);
    const educationData = {...req.body};
    const { id } = req.user;

    if (!isValid) {
      return res.status(400).json(errors);
    }

    ProfilesService.addEducation(id, educationData, errorMessages)
      .then(profile => res.status(201).json(profile))
      .catch(err => {
        if (err.noProfile) res.status(404).json(err);
      });
  };

  deleteEducationFromProfileById(req, res) {
    const { edu_id } = req.params;
    const { id } = req.user;

    ProfilesService.deleteEducation(id, edu_id, errorMessages)
      .then(profile => res.json(profile))
      .catch(err => {
        if (err.noProfile || err.experience_not_found)
          res.status(404).json(err)
      });
  };

  deleteAccountForUser(req, res) {
    const { id } = req.user;
    ProfilesService.deleteProfileAndUser(id)
      .then(() => res.status(204).json());
  };
};
export default new ProfilesController();