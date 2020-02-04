import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import passport from 'passport';
import { Request, Response, NextFunction } from "express";

import UserModel from '../models/User';
import { User } from "devconnector-types/interfaces";
import Keys from "./keys";

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Keys.secret;

export class PassportManager {
  static initialize = () => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done): void => {
        UserModel.findById(jwt_payload.id)
          .then(user => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch(err => console.log(err));
      })
    );
  };

  static authenticate = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('jwt', { session: false }, (err, user: User, info) => {
      if (err) { return next(err); }
      if (!user) {
          if (info.name === "TokenExpiredError") {
              return res.status(401).json({ message: "Your token has expired." });
          } else {
              return res.status(401).json({ message: info.message });
          }
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
}

export default PassportManager;