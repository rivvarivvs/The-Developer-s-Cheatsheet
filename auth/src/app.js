const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

const app = express();

// Setup initializations
// app.set('trust proxy', false);
app.use(express.json());
app.use(
	cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/current-user'));

app.all('*', () => {
	throw new NotFoundError();
});

module.exports = app;
