import app from './app';
import mongoose from 'mongoose';
import config from './config/keys';

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected.'))
  .catch((err: Error) => console.log(err));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
const handleExit = (signal: string) => {
  console.log(`Received ${signal}. Fulfilling open requests and shutting down server.`)

  server.close(() => {
    console.log('Server closed.');
    mongoose.disconnect((err) => {
      console.log('Database connection closed. Preparing to exit.');
      process.exit(err ? 1 : 0)
    });
  });
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('SIGQUIT', handleExit);