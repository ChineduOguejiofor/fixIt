const { Client } = require('pg');
require('dotenv/config');

const client = new Client({
  user: process.env.dbUserName,
  password: process.env.myPass,
  port: 5432,
  database: process.env.dbName
});
const connectDB = async () => {
  await client.connect();
  console.log('Connected successfully');
};

const insertUser = async (name, email, avatar, password) => {
  const table = 'users';
  try {
    const sql = `INSERT INTO ${table}(name,email,avatar,password) VALUES ($1, $2,$3,$4) RETURNING id`;
    const params = [name, email, avatar, password];
    const result = await client.query(sql, params);
    const newlyCreatedUserId = result.rows[0].id;
    console.log('inserted');
    return newlyCreatedUserId;
  } catch (error) {
    console.log('Failed on Error');
    console.log(error);
  }
};

const querydb = async qbody => {
  try {
    const sql = `
       SELECT 
          id, name, email, avatar, 
          is_admin AS "isAdmin", created_date AS "createdDate", 
          modified_date AS "modifiedDate" 
        FROM users 
       WHERE email = $1`;
    const params = [qbody];
    const result = await client.query(sql, params);
    const newlyCreatedUserId = result.rows[0];

    return newlyCreatedUserId;
  } catch (error) {
    return error;
  }
};

const qpass = async qbody => {
  try {
    const sql = 'SELECT id, password FROM users WHERE email = $1';
    const params = [qbody];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {}
};

const insertRequest = async (title, type, body, image, userId) => {
  const table = 'requests';
  try {
    const sql = `INSERT INTO ${table}(title,requestType,body,image,user_id) VALUES ($1, $2,$3,$4,$5) RETURNING *`;
    const params = [title, type, body, image, userId];
    const result = await client.query(sql, params);
    console.log(result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.log('An Insertion Error has occured ' + error);
  }
};

const getRequest = async quserId => {
  try {
    const sql = `SELECT * FROM requests WHERE user_id = $1`;
    const params = [quserId];
    const result = await client.query(sql, params);

    return result.rows;
  } catch (error) {
    console.log('Failed on error');
    return error;
  }
};

const getSingleRequest = async (quserId, reqid) => {
  try {
    const sql = `SELECT * FROM requests WHERE user_id = $1 AND id = $2`;
    const params = [quserId, reqid];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on error');
    return error;
  }
};

const modifyRequest = async (body, image, reqId) => {
  try {
    const sql = `UPDATE requests SET body = $1 ,image = $2 ,modified_date = NOW() WHERE id = $3 RETURNING *`;
    const params = [body, image, reqId];
    const result = await client.query(sql, params);
    console.log(result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.log('Failed on error ' + error);
  }
};
const isAdmin = async searchId => {
  try {
    const sql = `SELECT is_admin AS "isAdmin" FROM users WHERE id = $1`;
    const params = [searchId];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on err' + error);

    return error;
  }
};

const getAllRequest = async () => {
  try {
    const sql = `SELECT * FROM requests`;
    const result = await client.query(sql);
    return result.rows;
  } catch (error) {
    return error;
  }
};

const getRequestById = async reqId => {
  try {
    const sql = `SELECT * FROM requests WHERE id = $1`;
    const params = [reqId];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on error');
    return error;
  }
};
approveReq;

const approveReq = async reqId => {
  try {
    const sql = `UPDATE requests SET is_approved = TRUE WHERE id = $1 RETURNING *`;
    const params = [reqId];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on error ' + error);
  }
};

const disapproveReq = async reqId => {
  try {
    const sql = `UPDATE requests SET is_approved = FALSE WHERE id = $1 RETURNING *`;
    const params = [reqId];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on error ' + error);
  }
};

const resolveReq = async reqId => {
  try {
    const sql = `UPDATE requests SET is_resolved = TRUE WHERE id = $1 RETURNING *`;
    const params = [reqId];
    const result = await client.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log('Failed on error ' + error);
  }
};

module.exports = {
  insertUser,
  connectDB,
  querydb,
  qpass,
  insertRequest,
  getRequest,
  getSingleRequest,
  modifyRequest,
  getAllRequest,
  isAdmin,
  getRequestById,
  approveReq,
  disapproveReq,
  resolveReq
};
