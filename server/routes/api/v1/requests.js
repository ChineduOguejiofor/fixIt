const express = require('express');
const router = express.Router();
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
      const { is_approved } = await db.getRequestById(req.params.request_id);

      if (is_approved) {
        return res
          .status(412)
          .json({ msg: 'Request has already been approved' });
      } else {
        const result = await db.approveReq(req.params.request_id);
        return res.json({ result });
      }
    } else {
      res.status(401).json({ msg: 'You are not Authorized to view this' });
    }
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

//@PUT /request/:request_id/disapprove
//desc Dispproves a request. Must be Admin, request Must have been approved
//@ protection PRIVATE
router.put('/:request_id/disapprove', auth, async (req, res) => {
  try {
    const { isAdmin } = await db.isAdmin(req.user.id);
    if (isAdmin) {
      const { is_approved } = await db.getRequestById(req.params.request_id);
      if (is_approved) {
        const result = await db.disapproveReq(req.params.request_id);
        return res.json({ result });
      } else {
        return res.status(412).json({ msg: 'Request has not been approved' });
      }
    } else {
      res.status(401).json({ msg: 'You are not Authorized to view this' });
    }
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

//@PUT /request/:request_id/resolve
//desc Resolves a request. Must be Admin, request Must have been approved
//@ protection PRIVATE
router.put('/:request_id/resolve', auth, async (req, res) => {
  try {
    const { isAdmin } = await db.isAdmin(req.user.id);
    if (isAdmin) {
      const { is_approved, is_resolved } = await db.getRequestById(
        req.params.request_id
      );
      if (is_resolved) {
        return res
          .status(412)
          .json({ msg: 'Request has already been resolved' });
      } else {
        if (is_approved) {
          const result = await db.resolveReq(req.params.request_id);
          return res.json({ result });
        } else {
          return res.status(412).json({ msg: 'Request has not been approved' });
        }
      }
    } else {
      res.status(401).json({ msg: 'You are not Authorized to view this' });
    }
  } catch (error) {
    req.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
