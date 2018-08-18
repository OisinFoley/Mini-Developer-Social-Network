const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load profile model
const Profile = require('../../models/Profile');

// load user profile
const User = require('../../models/User');

// @route GET api/profile/test
// @desc tests profile route
// @access Public
router.get('/test', (req, res) =>
  res.json({
    message: 'Profile works!'
  })
);

// @route GET api/profile/
// @desc gets current user's profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'Profile not found!';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
