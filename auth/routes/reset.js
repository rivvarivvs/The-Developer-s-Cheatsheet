const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { jwt_key } = require('../../config');

const router = express.Router();

router.post('/reset', async (req, res) => {});

router.post('/reset/:token', async (req, res) => {});
