'use strict';

var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  var token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization denied' });
  }
  try {
    var decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not Valid' });
  }
  return null;
};