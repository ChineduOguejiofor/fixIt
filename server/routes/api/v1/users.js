const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const db = require('./dbinsert');
const { check, validationResult } = require('express-validator');
// @route GET api/v1/users
// @desc gets user info
// @access Private Route

let userId = '';
router.post(
  '/',
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
      // let user =

      // // check if user exists
      // if (usersarr.includes(email)) {
      //   return res.status(400).json({ errors: [{ msg: 'User aleady exist' }] });
      // }
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
