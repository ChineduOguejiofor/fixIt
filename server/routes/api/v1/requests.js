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
    const { isAdmin } = await db.isAdmin(req.user.id);
    if (isAdmin) {
      const result = await db.getAllRequest();
      res.json({ result });
    } else {
      res.status(401).json({ msg: 'You are not Authorized to view this' });
    }
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

//@PUT /request/:request_id/approve
//desc Approves a request. Must be Admin
//@ protection PRIVATE
router.put('/:request_id/approve', auth, async (req, res) => {
  try {
    const { isAdmin } = await db.isAdmin(req.user.id);
    if (isAdmin) {
      const result = await db.getAllRequest();
      res.json({ result });
    } else {
      res.status(401).json({ msg: 'You are not Authorized to view this' });
    }
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
