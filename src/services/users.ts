import User from '../models/User';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// TODO: fix erroneous import of key values
// import keys from '../config/keys';
var tempSecret = 'oisinsSecretKey';

class UsersService {
  // TODO: interface type against these parameters
  register(userData: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      const { email, password } = userData;
      User.findOne({ email })
      // TODO: interface for user model
        .then((user: any) => {
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
                // TODO: interface for this arg
                .then((user: any) => resolve(user))
                .catch((err: Error) => {
                  console.log(err);
                  reject(err);
                });
            });
          });
        });
    });
  };

  // TODO: interface type against these parameters
  login(props: any, errorMessages: any) {
    return new Promise((resolve, reject) => {
      const { email, password } = props;
      User.findOne({ email })
      // TODO: interface type against these parameters
        .then((user: any) => {
          if (!user)
            return reject({ emailNotFound: errorMessages.no_user_for_email });
      
          // check password
          bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
              return reject({ password: errorMessages.password_not_match });

            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            // assign JWT
            // jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
            // TODO: remove tempSecret once config import issue is resolved
            jwt.sign(payload, tempSecret, { expiresIn: 3600 }, (err, token) => {
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