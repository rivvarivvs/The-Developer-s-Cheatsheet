const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

const item = require('./routes/item');
const auth = require('./routes/auth');
const currentUser = require('./routes/current-user');

const app = express();

//Setup initializations
// app.set('trust proxy', false);
app.use(express.json());
app.use(
	cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use(item);
app.use(auth);
app.use(currentUser);

app.all('*', () => {
	throw new NotFoundError();
});

module.exports = app;
