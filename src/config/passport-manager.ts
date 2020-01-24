import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import User from '../models/User';
// TODO: fix erroneous import of key values
// import keys from "./keys";
var keys = { secret: 'oisinsSecretKey' };
import passport from 'passport';
import { Request, Response, NextFunction } from "express";
import IUser from "../interfaces/IUser";

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

// class PassportManager {
  export const initialize = () => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
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

  export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err, user: IUser, info) => {
      if (err) { return next(err); }
      // use interface here
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