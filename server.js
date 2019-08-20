// const app = require("./src/app");
// const mongoose = require('mongoose');
// const db = require('./src/config/keys').mongoURI;

import app from './src/app';
import mongoose from 'mongoose';
import { mongoURI as db } from './src/config/keys';
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected.'))
  .catch(err => console.log(err));
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));