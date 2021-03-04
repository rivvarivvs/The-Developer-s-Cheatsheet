const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();

// Setup initializations
// app.set('trust proxy', false);
app.use(bodyparser.json());
app.use(cookieSession({ signed: false }));

// setting up views and static files dir
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', require('./auth/routes/signup'));
app.use('/users', require('./auth/routes/signin'));
app.use('/users', require('./auth/routes/signout'));
app.use('/users', require('./auth/routes/reset'));
app.use('/post', require('./post/routes/destroy'));
app.use('/post', require('./post/routes/postNew'));
app.use('/post', require('./post/routes/show'));
app.use('/post', require('./post/routes/showAll'));
app.use('/post', require('./post/routes/update'));

module.exports = app;
