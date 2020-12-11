const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const { MongoDBStore } = require("connect-mongodb-session")(session);

require("dotenv").config();

const app = express();

//Set up mongoose connection
const mongoDB = process.env.DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Set up session store
const store = new MongoDBStore({
  uri: process.env.DB,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(cors());
app.use(express.json());
app.use("api/item", require("./routes/api/item"));
app.use("api/user", require("./routes/api/user"));
app.use("api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server start on port: ${port}`);
});
