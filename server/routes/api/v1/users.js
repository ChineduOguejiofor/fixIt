const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const db = require('./dbinsert');

//@ POST users/request
//@ desc Create a request
//@ protection PRIVATE
router.post(
  '/',
  [
    auth,
    [
      check('desc', 'please add a description')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const result = await db.insertRequest(
        req.body.desc,
        req.body.image,
        req.user.id
      );
      res.json({ result });
    } catch (error) {
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

//@ GET users/request
//@ desc Gets all the request of a logged in user
//@ protection PRIVATE

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.getRequest(req.user.id);
    res.json({ result });
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
