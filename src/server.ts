import app from './app';
import mongoose from 'mongoose';
import config from './config/keys';

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected.'))
  .catch((err: Error) => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));