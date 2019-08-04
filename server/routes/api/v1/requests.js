const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../../middleware/auth');
const db = require('./dbinsert');

//@ GET /requests
//@ desc Gets all  requests. Must be Admin
//@ protection PRIVATE
router.get('/', auth, async (req, res) => {
  try {
    const myUser = req.user;
    return res.json({ myUser });

    const result = await db.getRequest(req.user.id);
    res.json({ result });
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
