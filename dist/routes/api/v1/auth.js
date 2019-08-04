'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../../middleware/auth');
var bcrypt = require('bcryptjs');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var jwt = require('jsonwebtoken');
var db = require('./dbinsert');
var gravatar = require('gravatar');
require('dotenv/config');

var cors = require('cors');
router.use(cors());

// @route GET api/auth
// @ desc returns the user
// @access Public

router.get('/', auth, async function (req, res) {
  try {
    var user = await db.querydb(req.user.id);
    res.json({ user: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route POST api/auth/login
// @ desc Authenticate user and get token
// @access Public

router.post('/login', [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()], async function (req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;


  try {
    var user = await db.qpass(email);

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    var isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    var payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.jwtSecret, { expiresIn: 36000 }, function (err, token) {
      if (err) throw err;
      res.json({ token: token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route POST api/v1/auth/signup
// @desc Registers a user
// @access PUBLIC

var userId = '';
router.post('/signup', [check('name', 'name is required').not().isEmpty(), check('email', 'Please enter a valid email').isEmail(), check('password', 'Please enter a password with min length of 6').isLength({
  min: 6
})], async function (req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var _req$body2 = req.body,
      name = _req$body2.name,
      email = _req$body2.email,
      password = _req$body2.password;

  try {
    // Search for user in db
    var user = await db.qpass(email);

    // check if user exists
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User aleady exist' }] });
    }
    // Get the gravatar
    var avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    // Encrty password
    var salt = await bcrypt.genSalt(10);

    var passwordHash = await bcrypt.hash(password, salt);

    try {
      userId = await db.insertUser(name, email, avatar, passwordHash);
    } catch (error) {
      console.log('Faied on error');
      console.log(error);
    }

    try {
      var payload = {
        user: {
          id: userId
        }
      };
      jwt.sign(payload, process.env.jwtSecret, { expiresIn: 36000 }, function (err, token) {
        if (err) throw err;
        res.json({ token: token });
      });
    } catch (error) {
      console.log('error from payload' + error);
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error from me here' });
  }
});

module.exports = router;