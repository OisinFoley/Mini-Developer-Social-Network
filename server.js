let express = require('express');
let mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");


let app = express();

// db config
const db = require('./config/keys').mongoURI;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected.'))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello world"));


// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));