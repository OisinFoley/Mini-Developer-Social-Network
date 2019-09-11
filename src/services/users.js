import User from '../models/User';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';

class UsersService {
  register(userData, errorMessages) {
    return new Promise((resolve, reject) => {
      const { email, password } = userData;
      User.findOne({ email })
        .then(user => {
          if (user) 
            return reject({ email: errorMessages.email_already_taken });
          
          const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });
    
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                console.log(`Error is ${err}`);
                throw err;
              }
    
              // set hashed password as value to send in payload
              userData.password = hash;
              new User(userData)
                .save()
                .then(user => resolve(user))
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
            });
          });
        });
    });
  };

  login(props, errorMessages) {
    return new Promise((resolve, reject) => {
      const { email, password } = props;
      User.findOne({ email })
        .then(user => {
          if (!user)
            return reject({ email: errorMessages.no_user_for_email });
      
          // check password
          bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
              return reject({ password: errorMessages.password_not_match });

            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            // assign JWT
            jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
              resolve({
                success: true,
                token: `Bearer ${token}`
              });
            });
          });
        });
    });
  };
};

export default new UsersService();