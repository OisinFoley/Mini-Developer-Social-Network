const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const errorMessages = require('../../error-handling/strings');


const PassportManager = require('../../config/passport-manager');

// @route GET api/users/test
// @desc tests users route
// @access Public

router.get('/test', (req, res) =>
  res.json({
    message: 'Users works!'
  })
);

// @route POST api/users/register
// @desc Registers user
// @access Public

registerUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = errorMessages.email_already_taken;
      res.status(400).json(errors);
    } else {
      let { body } = req;
      const avatar = gravatar.url(body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(`Error is ${err}`);
            throw err;
          }

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
};
router.post('/register', registerUser);

// @route POST api/users/login
// @desc Login user, returns JWT
// @access Public

loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = errorMessages.no_user_for_email;
      return res.status(404).json(errors);
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //create JWT payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // assign JWT
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        });
      } else {
        errors.password = errorMessages.password_not_match;
        return res.status(400).json(errors);
      }
    });
  });
};
router.post('/login', loginUser);


// @route GET api/users/current
// @desc Return current user
// @access Private

getCurrentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};
router.get('/current', PassportManager.authenticate, getCurrentUser);

module.exports = router;