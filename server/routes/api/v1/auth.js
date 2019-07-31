const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const db = require('./dbinsert');
const gravatar = require('gravatar');

const cors = require('cors');
router.use(cors());

// @route GET api/auth
// @ desc returns the user
// @access Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await db.querydb(req.user.id);
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth/login
// @ desc Authenticate user and get token
// @access Public

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await db.qpass(email);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/v1/auth/signup
// @desc Registers a user
// @access PUBLIC

let userId = '';
router.post(
  '/signup',
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with min length of 6').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // Search for user in db
      let user = await db.qpass(email);

      // check if user exists
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User aleady exist' }] });
      }
      // Get the gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Encrty password
      const salt = await bcrypt.genSalt(10);

      const passwordhash = await bcrypt.hash(password, salt);

      try {
        userId = await db.insertUser(name, email, avatar, passwordhash);
      } catch (error) {
        console.log('Faied on error');
        console.log(error);
      }

      try {
        const payload = {
          user: {
            id: userId
          }
        };
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 36000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (error) {
        console.log('error from payload' + error);
      }
    } catch (error) {
      res.status(500).send('Server Error from me here');
    }
  }
);

module.exports = router;
