const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyparser = require('body-parser');

const app = express();

// Setup initializations
// app.set('trust proxy', false);
app.use(bodyparser.json());
app.use(cookieSession({ signed: false }));

app.use('/users', require('./auth/routes/signup'));
app.use('/users', require('./auth/routes/signin'));
app.use('/users', require('./auth/routes/signout'));
app.use('/post', require('./post/routes/destroy'));
app.use('/post', require('./post/routes/postNew'));
app.use('/post', require('./post/routes/show'));
app.use('/post', require('./post/routes/showAll'));
app.use('/post', require('./post/routes/update'));

module.exports = app;
