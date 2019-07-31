const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'Alvaro334',
  // host: 'Ojumo',
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
    /* 
    const result = await client.query(queryText, ['841l14yah', 'test@te.st']);
  const newlyCreatedUserId = result.rows[0].id;
    
    */
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
    console.log(await client.query(sql, params));
    return await client.query(sql, params);
    // const result = await client.query(sql, params);
    // const newlyCreatedUserId = result.rows[0].id;
    return newlyCreatedUserId;
  } catch (error) {
    return error;
  }
};
module.exports = { insertUser, connectDB, querydb };
