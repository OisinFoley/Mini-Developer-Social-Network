const app = require("./src/app");
const mongoose = require('mongoose');
const db = require('./src/config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected.'))
  .catch(err => console.log(err));
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));