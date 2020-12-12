const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoDBStore } = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require('connect-flash')

require("dotenv").config();
const isCsrf = require("middleware/crsf");

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
app.use(csrf());
app.use(isCsrf())
app.use(flash())
app.use(express.json());
app.use("/item", require("./routes/item"));
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server start on port: ${port}`);
});
