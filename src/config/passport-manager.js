import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import User from '../models/User';
import keys from "./keys";
import passport from 'passport';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

class PassportManager {
  initialize() {
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

  authenticate(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
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

module.exports = new PassportManager();