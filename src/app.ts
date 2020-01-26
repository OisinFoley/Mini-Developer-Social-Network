import express from 'express';
import { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import path from 'path';

import userRoutes from './routes/api/users';
import profileRoutes from './routes/api/profiles';
import postRoutes from './routes/api/posts';
import { getStatusCodeFromError } from './utils/responseStatusCalculator';
import { PassportManager } from './config/passport-manager';

let app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
PassportManager.initialize();

// use routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/posts', postRoutes);

// error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`Error: on request to ${req.headers.origin}${req.url}`);
  console.log(JSON.stringify(err));

  const statusCode = getStatusCodeFromError(err);
  res.status(statusCode).json(err);
});

// serve static assets if production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  });
}

export default app;