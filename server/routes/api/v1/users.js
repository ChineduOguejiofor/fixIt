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
//@ desc Gets all  requests of the logged in user
//@ protection PRIVATE
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.getRequest(req.user.id);
    res.json({ result });
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

//@ GET users/request/:request_id
//@ desc Gets a single request of the logged in user
//@ protection PRIVATE

router.get('/:request_id', auth, async (req, res) => {
  try {
    const requestedID = req.params.request_id;
    if (isNaN(requestedID)) {
      return res.status(404).json({ msg: 'Request does not exist' });
    }
    const result = await db.getSingleRequest(req.user.id, requestedID);
    console.log(result === undefined);

    if (!result) {
      return res.status(404).json({ msg: 'Request does not exist' });
    }
    res.json({ result });
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

//@ PUT users/request/:request_id
//@ desc Modify a single request of the logged in user
//@ protection PRIVATE

router.put(
  '/:request_id',
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
      const requestedID = req.params.request_id;
      if (isNaN(requestedID)) {
        return res.status(404).json({ msg: 'Request does not exist' });
      }
      const request = await db.getSingleRequest(req.user.id, requestedID);
      console.log(request.is_approved);
      if (request.is_approved) {
        return res.status(406).json({
          msg: 'Request has already been approved, Cannot be modified'
        });
      }

      const result = await db.modifyRequest(
        req.body.desc,
        req.body.image,
        requestedID
      );

      if (!result) {
        return res.status(404).json({ msg: 'Request does not exist' });
      }
      res.json({ result });
    } catch (error) {
      req.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;
