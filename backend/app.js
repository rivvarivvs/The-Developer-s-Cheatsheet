const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

require('dotenv').config();

const item = require('./routes/item');
const auth = require('./routes/auth');
const currentUser = require('./routes/current-user');

const app = express();

//Set up mongoose connection
try {
	const mongoDB = process.env.DB;
	mongoose.connect(mongoDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
} catch (err) {
	console.log(err);
}

//Setup initializations
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({ signed: false }));

app.use(item);
app.use(auth);
app.use(currentUser);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server start on port: ${port}`);
});

module.exports = app;
