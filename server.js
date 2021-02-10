const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

require('dotenv').config();

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
app.use(json());
app.use(cookieSession({ signed: false }));

app.use('/item', require('./routes/item'));
app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server start on port: ${port}`);
});
