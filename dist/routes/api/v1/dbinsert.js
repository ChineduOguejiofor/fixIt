'use strict';

var _require = require('pg'),
    Client = _require.Client;

require('dotenv/config');

var client = new Client({
  user: process.env.dbUserName,
  password: process.env.myPass,
  port: 5432,
  database: process.env.dbName
});
var connectDB = async function connectDB() {
  await client.connect();
  console.log('Connected successfully');
};

var insertUser = async function insertUser(name, email, avatar, password) {
  var table = 'users';
  try {
    await client.query('BEGIN');
    var sql = 'INSERT INTO ' + table + '(name,email,avatar,password) VALUES ($1, $2,$3,$4) RETURNING id';
    var params = [name, email, avatar, password];
    var result = await client.query(sql, params);
    var newlyCreatedUserId = result.rows[0].id;
    await client.query('COMMIT');
    console.log('inserted');
    return newlyCreatedUserId;
  } catch (error) {
    console.log('Failed on Error');
    console.log(error);

    await client.query('ROLLBACK');
  }
};

var querydb = async function querydb(qbody) {
  try {
    var sql = ' SELECT id, name, email, avatar, is_admin, created_date, modified_date FROM users WHERE id = $1';
    var params = [qbody];
    var result = await client.query(sql, params);
    var newlyCreatedUserId = result.rows[0];

    return newlyCreatedUserId;
  } catch (error) {
    return error;
  }
};

var qpass = async function qpass(qbody) {
  try {
    var sql = 'SELECT id, password FROM users WHERE email = $1';
    var params = [qbody];
    var result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {}
};

var insertRequest = async function insertRequest(body, image, userId) {
  var table = 'requests';
  try {
    var sql = 'INSERT INTO ' + table + '(body,image,user_id) VALUES ($1, $2,$3) RETURNING *';
    var params = [body, image, userId];
    var result = await client.query(sql, params);
    console.log(result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.log('Failed on error ' + error);
  }
};

var getRequest = async function getRequest(quserId) {
  try {
    var sql = 'SELECT * FROM requests WHERE user_id = $1';
    var params = [quserId];
    var result = await client.query(sql, params);

    return result.rows;
  } catch (error) {
    console.log('Failed on error');
    return error;
  }
};

var getSingleRequest = async function getSingleRequest(quserId, reqid) {
  try {
    var sql = 'SELECT * FROM requests WHERE user_id = $1 AND id = $2';
    var params = [quserId, reqid];
    var result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on error');
    return error;
  }
};

var modifyRequest = async function modifyRequest(body, image, reqId) {
  try {
    var sql = 'UPDATE requests SET body = $1 ,image = $2 ,modified_date = NOW() WHERE id = $3 RETURNING *';
    var params = [body, image, reqId];
    var result = await client.query(sql, params);
    console.log(result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.log('Failed on error ' + error);
  }
};
module.exports = {
  insertUser: insertUser,
  connectDB: connectDB,
  querydb: querydb,
  qpass: qpass,
  insertRequest: insertRequest,
  getRequest: getRequest,
  getSingleRequest: getSingleRequest,
  modifyRequest: modifyRequest
};