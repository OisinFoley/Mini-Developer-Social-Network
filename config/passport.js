const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("user");
const keys = require("./keys");

const MockStrategy = require('./mock-strategy').Strategy;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

// need to make sure you set env at cmd using export NODE_ENV=test
console.log(process.env.NODE_ENV);

function strategyCallback(jwt_payload, done) {
  // Possibly User.findOrCreate({…}) or similar
  let u = {
    date: '2018-11-11T00:04:19.666Z',
    _id: '5be772318a0efa11e7a68014',
    name: 'Oisín Foley',
    email: 'oisinfoleysligo@gmail.com',
    avatar: 'https://angel.co/cdn-cgi/image/width=200,height=200,format=auto,fit=cover/https://d1qb2nb5cznatu.cloudfront.net/users/2094932-original?1563725982',
    password: '$2a$10$JaKVGehh7FK.sqUIlL5QWO.vL2Ux2dvXSHKnPzyDmh1HzFFxYPNpO'
  };

  done(null, u);
}

// this is a tmp solution that works, but not sure how we can tweak it 
// to trigger fails when desired
// plus, it's not good to have this logic for testing embedded in actual production code
// so, we should go back to trying to stub

strategyForEnvironment = () => {
  let strategy;

  if (process.env.NODE_ENV === 'test') {
    strategy = new MockStrategy('jwt', strategyCallback);
  } else {
    strategy = new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  return strategy;
};

module.exports = passport => {
  passport.use(strategyForEnvironment());
};

// module.exports = passport => {
//   passport.use(
//     new JwtStrategy(opts, (jwt_payload, done) => {
//     User.findById(jwt_payload.id)
//       .then(user => {
//         if (user) {          
//           return done(null, user);
//         }
//         return done(null, false);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
// )};
