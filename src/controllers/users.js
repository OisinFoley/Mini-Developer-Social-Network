import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import errorMessages from '../error-handling/strings';

class UsersController {
  async registerUser (req, res) {
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

  async loginUser (req, res) {
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

  async getCurrentUser (req, res) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  };
};
export default new UsersController();