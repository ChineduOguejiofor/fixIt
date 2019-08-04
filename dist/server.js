'use strict';

var express = require('express');
var app = express();
var db = require('./routes/api/v1/dbinsert');
require('dotenv').config();

app.use(express.json({ extended: false }));

app.get('/', function (req, res) {
  return res.json({ msg: 'API is running' });
});
db.connectDB();
// Defining routes
app.use('/api/users/requests', require('./routes/api/v1/users'));
app.use('/api/auth', require('./routes/api/v1/auth'));
app.use('/api/requests', require('./routes/api/v1/requests'));

var PORT = process.env.PORT;

app.listen(PORT, function () {
  return console.log('Server started on port ' + PORT);
});