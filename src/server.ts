import app from './app';
import mongoose from 'mongoose';
// import { mongoUri as db } from './config/keys';
let mongoUri = require('./config/keys');
// import mongoUri from './config/keys';
// let db = mongoUri;

console.log(`monguri is ${JSON.stringify(mongoUri)}`);
// console.log(`monguri is ${mongoUri}`);

// TODO: fix this so that it's not hard-coded
// hard-coded test in order to get first instance of ts=based app running
let db = 'mongodb://oisinfoley:p1nec0ne@ds127894.mlab.com:27894/oisinfoleymongo';

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected.'))
  .catch((err: any) => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));