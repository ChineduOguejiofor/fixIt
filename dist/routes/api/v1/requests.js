'use strict';

var express = require('express');
var router = express.Router();

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var auth = require('../../../middleware/auth');
var db = require('./dbinsert');

//@ GET /requests
//@ desc Gets all  requests. Must be Admin
//@ protection PRIVATE
router.get('/', auth, async function (req, res) {
  try {
    var myUser = req.user;
    return res.json({ myUser: myUser });

    var result = await db.getRequest(req.user.id);
    res.json({ result: result });
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;