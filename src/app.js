import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import path from 'path';
import userRoutes from './routes/api/users';
import profileRoutes from './routes/api/profiles';
import postRoutes from './routes/api/posts';

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

export default app;