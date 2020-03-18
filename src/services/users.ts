import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import Keys from '../config/keys';
import {
  UserModel,
  CreateUserInput,
  LoginInput,
  LoginResponse,
  UserAuthentication
} from 'devconnector-types/interfaces';

class UsersService {
  register(userData: CreateUserInput, errorStrings: any): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const { email, password } = userData;
      User.findOne({ email })
        .then((user: UserModel | null) => {
          if (user) 
            return reject({ email: errorStrings.email_already_taken });
          
          // TODO: replace with functionality to set custom profile image
          const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });
    
          bcrypt.genSalt(10, (err: Error, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                console.log(`Error is ${err}`);
                throw err;
              }
    
              // set hashed password as value to send in payload
              userData.password = hash;
              userData.avatar = avatar;
              new User(userData)
                .save()
                .then((user: UserModel) => resolve(user))
                .catch((err: Error) => {
                  console.log(err);
                  reject(err);
                });
            });
          });
        });
    });
  };

  login(props: LoginInput, errorStrings: any): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      const { email, password } = props;
      User.findOne({ email })
        .then((user: UserAuthentication | null) => {
          if (!user)
            return reject({ emailNotFound: errorStrings.no_user_for_email });
      
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch)
                return reject({ password: errorStrings.password_not_match });

              const payload = { id: user.id, name: user.name, avatar: user.avatar };
              // assign JWT
              jwt.sign(payload, Keys.secret, { expiresIn: 3600 }, (err, token) => {
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