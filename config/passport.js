const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("user");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log('in the passport config file');
      console.log('*****passport here');
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            console.log('*****passport here');
            
            return done(null, user);
          }
          console.log('*****passport here');
          return done(null, false);
        })
        .catch(err => {
          console.log('in the passport config file');
          console.log(err);
        });
    })
  );
};
