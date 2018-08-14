const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// load User model
const User = require('../../models/User');

// @route GET api/users/test
// @desc tests users route
// @access Public

router.get('/test', (req, res) => res.json({
  message: 'Users works!'
}));

// @route POST api/users/register
// @desc Registers user
// @access Public

router.post('/register', (req, res) =>
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).json({email: 'Email already taken!'});
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
          password: req.body.password,
          // name,
          // email,
          // avatar,
          // password

        // } = body );
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
          })
        })
      }
    })
);

// @route POST api/users/login
// @desc Login user, returns JWT
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({email}).then(user => {
    if (!user) {
      return res.status(404).json({message: 'User does not exist'});
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "success" });
      } else {
        return res.status(400).json({ msg: 'Password does not match! '});
      }
    });
  });
});

module.exports = router;