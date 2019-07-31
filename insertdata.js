const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'Alvaro334',
  host: 'Ojumo',
  port: 5432,
  database: 'test'
});

insertinto();
const collection = 'users';
async function insertinto() {
  try {
    await client.connect();
    console.log('Connected successfully');
    await client.query('BEGIN');
    const insertHeaders = `INSERT INTO ${collection}(name,email,password) VALUES ($1, $2,$3)`;
    const insertValues = ['chiKnight', 'chiFW@yahoo.com', 'eiowdjQQeilse'];
    client.query(insertHeaders, insertValues);
    await client.query('COMMIT');
    console.log('inserted');
  } catch (error) {
    console.log('Failed on Error');
    await client.query('ROLLBACK');
  } finally {
    await client.end();
    console.log('Cleaned');
  }
}
