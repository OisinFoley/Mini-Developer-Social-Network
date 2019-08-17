const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
const errorMessages = require('../../error-handling/strings');

// @route GET api/profiles/
// @desc gets current user's profile
// @access Private
getCurrentUsersProfile = (req, res) => {
  let errors = {};

  //  tmp solution
  req.user = {};
  req.user.id = '5d497baeed8f0b4d00ece2cb'; // 200 RESPONSE
  req.user.name = 'test_name';
  req.user.avatar = 'test_avatar';

  req.user.id = '5d497baeed8f0b4d00e12345'; // 404 RESPONSE

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = errorMessages.profile_not_found_for_current_user;
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};
// tmp solution
router.get('/', getCurrentUsersProfile);

// router.get(
//   '/',
//   passport.authenticate('jwt', { session: false }), getCurrentUsersProfile);

// @route GET api/profiles/all
// @desc get all profiles
// @access public

getAllProfiles = (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noProfiles = errorMessages.profiles_not_found;
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: errorMessages.profiles_not_found }));
};
router.get('/all', getAllProfiles);

// @route GET api/profiles/handle/:handle
// @desc get profile by their handle
// @access public

getProfileByHandle = (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = errorMessages.profile_not_found_for_handle;
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};
router.get('/handle/:handle', getProfileByHandle);

// @route GET api/profiles/user/:user_id
// @desc get profile by user_id
// @access public

getProfileByUserId = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = errorMessages.profile_not_found_for_user_id;
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: errorMessages.profile_not_found_for_user_id })
    );
};
router.get('/user/:user_id', getProfileByUserId);


// @route POST api/profiles/
// @desc creates or edit user's profile
// @access Private

setUserProfile = (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  
  // any validation erros are returned
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // tmp solution until we stub jwt
  req.user = {};
  // req.user.id = '5d497baeed8f0b4d00ece2cb'; // 400 STATUS

  // req.user.id = '5d4c5ddd1bf0b3474c7af3b7'; // 200 STATUS and UPDATE

  req.user.id = '5d4c7a547ba777f8311c728d'; // 200 STATUS and NEW PROFILE

  // get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;
  /* prettier-ignore */
  if (req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;

  //skills needs to be an array, based on schema
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      //update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
    } else {
      //create

      // see if handle exists
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = errorMessages.handle_already_exists;
          res.status(400).json(errors);
        }

        // do the save
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
};
// tmp until we stub jwt.authenticate
router.post('/', setUserProfile);

// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }), setUserProfile);

// @route POST api/profiles/experience
// @desc adds a user's experience to their profile
// @access Private

addNewExperience = (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // tmp solution until jwt authenticate stub is in place
  req.user = {};
  req.user.id = '5d4c5ddd1bf0b3474c7af3b7'; // 200 STATUS

  Profile.findOne({ user: req.user.id }).then(profile => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    profile.experience.unshift(newExp);

    profile.save().then(profile => res.json(profile));
  });
};
router.post('/experience', addNewExperience);

// router.post(
//   '/experience',
//   passport.authenticate('jwt', { session: false }), addNewExperience);

// @route DELETE api/profiles/experience/:exp_id
// @desc delete a user's experience from their profile
// @access Private

deleteExperienceById = (req, res) => {

  // tmp solution until jwt auth stub in place
  req.user = {}
  req.user.id = '5d4c5ddd1bf0b3474c7af3b7';

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // remove experience id out of the array
      profile.experience.splice(removeIndex, 1);

      // save the update
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.json(404).json(err));
};
router.delete('/experience/:exp_id', deleteExperienceById);

// router.delete(
//   '/experience/:exp_id',
//   passport.authenticate('jwt', { session: false }), deleteExperienceById);

// @route POST api/profiles/education
// @desc adds a user's education to their profile
// @access Private
addEducation = (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // tmp solution until jwt authenticate stub is in place
  req.user = {};
  req.user.id = '5d4c5ddd1bf0b3474c7af3b7'; // 200 STATUS

  Profile.findOne({ user: req.user.id }).then(profile => {
    
    
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldOfStudy: req.body.fieldOfStudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    profile.education.unshift(newEdu);

    profile.save().then(profile => res.json(profile));
  });
};

router.post('/education', addEducation);
// router.post(
//   '/education',
//   passport.authenticate('jwt', { session: false }), addEducation);

// @route DELETE api/profiles/education/:edu_id
// @desc delete a user's education from their profile
// @access Private

deleteEducation = (req, res) => {
  //  tmp solution
  req.user = {};
  req.user.id = '5d497baeed8f0b4d00ece2cb'; // 200 RESPONSE
  
  // req.user.id = '5d497baeed8f0b4d00e12345'; // 404 RESPONSE

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // remove education id out of the array
      profile.education.splice(removeIndex, 1);

      // save the update
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.json(404).json(err));
};
router.delete('/education/:edu_id', deleteEducation);

// router.delete(
//   '/education/:edu_id',
//   passport.authenticate('jwt', { session: false }), deleteEducation);


// @route DELETE api/profiles/
// @desc delete user and their profile
// @access Private

deleteAccountForUser = (req, res) => {
  //  tmp solution
  req.user = {};
  req.user.id = '5d497baeed8f0b4d00ece2cb'; // 200 RESPONSE

  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() => {
      res.json({ success: true });
    });
  });
};
router.delete('/', deleteAccountForUser);

// router.delete(
//   '/',
//   passport.authenticate('jwt', { session: false }), deleteAccountForUser);

module.exports = router;
