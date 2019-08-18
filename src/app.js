const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const userRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profiles');
const postRoutes = require('./routes/api/posts');

let app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
require('./config/passport-manager').initialize(passport);

// use routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/posts', postRoutes);

// serve static assets if production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;