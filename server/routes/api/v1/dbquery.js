const insertUser = async (name, email, avatar, password) => {
  const { Client } = require('pg');
  const client = new Client({
    user: 'postgres',
    password: 'Alvaro334',
    // host: 'Ojumo',
    port: 5432,
    database: 'test'
  });

  const table = 'users';
  try {
    await client.connect();
    console.log('Connected successfully');
    await client.query('BEGIN');
    const insertHeaders = `INSERT INTO ${table}(name,email,avatar,password) VALUES ($1, $2,$3,$4)`;
    const insertValues = [name, email, avatar, password];
    client.query(insertHeaders, insertValues);
    await client.query('COMMIT');
    console.log('inserted');
  } catch (error) {
    console.log('Failed on Error');
    console.log(error);

    await client.query('ROLLBACK');
  } finally {
    await client.end();
    console.log('Cleaned');
  }
};

module.exports = { insertUser };
