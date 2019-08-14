const passport = require('passport-strategy');
const util = require('util');

const user = {
  date: '2018-11-11T00:04:19.666Z',
  _id: '5be772318a0efa11e7a68014',
  name: 'Oisín Foley',
  email: 'oisinfoleysligo@gmail.com',
  avatar: 'https://angel.co/cdn-cgi/image/width=200,height=200,format=auto,fit=cover/https://d1qb2nb5cznatu.cloudfront.net/users/2094932-original?1563725982',
  password: '$2a$10$JaKVGehh7FK.sqUIlL5QWO.vL2Ux2dvXSHKnPzyDmh1HzFFxYPNpO'
};



function Strategy(name, strategyCallback) {
  if (!name || name.length === 0) { throw new TypeError('DevStrategy requires a Strategy name') ; }
  passport.Strategy.call(this);
  this.name = name;
  this._user = user;

  this._cb = strategyCallback;
}
util.inherits(Strategy, passport.Strategy);
Strategy.prototype.authenticate = function() {
  this._cb(this._user, (error, user) => {
    this.success(user);
  });
}
module.exports = {
  Strategy
};