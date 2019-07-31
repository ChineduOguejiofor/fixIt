const { Client } = require('pg');
const config = require('config');
const client = new Client({
  user: config.get('userName'),
  password: config.get('myPass'),
  port: 5432,
  database: 'test'
});
const connectDB = async () => {
  await client.connect();
  console.log('Connected successfully');
};

const insertUser = async (name, email, avatar, password) => {
  const table = 'users';
  try {
    await client.query('BEGIN');
    const sql = `INSERT INTO ${table}(name,email,avatar,password) VALUES ($1, $2,$3,$4) RETURNING id`;
    const params = [name, email, avatar, password];
    const result = await client.query(sql, params);
    const newlyCreatedUserId = result.rows[0].id;
    await client.query('COMMIT');
    console.log('inserted');
    return newlyCreatedUserId;
  } catch (error) {
    console.log('Failed on Error');
    console.log(error);

    await client.query('ROLLBACK');
  }
  // finally {
  //   await client.end();
  //   console.log('Cleaned');
  // }
};

const querydb = async qbody => {
  try {
    const sql =
      ' SELECT id, name, email, avatar, is_admin, created_date, modified_date FROM users WHERE id = $1';
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
    // console.log(result.rows);

    return result.rows[0];
  } catch (error) {}
};
module.exports = { insertUser, connectDB, querydb, qpass };
