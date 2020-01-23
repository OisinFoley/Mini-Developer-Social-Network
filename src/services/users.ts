import User from '../models/User';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
import ICreateUserInput from '../interfaces/ICreateUserInput';
import ILoginUserInput from '../interfaces/ILoginUserInput';
import ILoginResponse from '../interfaces/ILoginResponse';

// TODO: fix erroneous import of key values
// import keys from '../config/keys';
var tempSecret = 'oisinsSecretKey';

class UsersService {
  register(userData: ICreateUserInput, errorMessages: any): Promise<IUser> {
    return new Promise((resolve, reject) => {
      const { email, password } = userData;
      User.findOne({ email })
        .then((user: IUser | null) => {
          if (user) 
            return reject({ email: errorMessages.email_already_taken });
          
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
              new User(userData)
                .save()
                .then((user: IUser) => resolve(user))
                .catch((err: Error) => {
                  console.log(err);
                  reject(err);
                });
            });
          });
        });
    });
  };

  login(props: ILoginUserInput, errorMessages: any): Promise<ILoginResponse> {
    return new Promise((resolve, reject) => {
      const { email, password } = props;
      User.findOne({ email })
        .then((user: IUser | null) => {
          if (!user)
            return reject({ emailNotFound: errorMessages.no_user_for_email });
      
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch)
                return reject({ password: errorMessages.password_not_match });

              const payload = { id: user.id, name: user.name, avatar: user.avatar };
              // assign JWT
              // jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
              // TODO: remove tempSecret once config import issue is resolved
              jwt.sign(payload, tempSecret, { expiresIn: 3600 }, (err: Error, token) => {
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