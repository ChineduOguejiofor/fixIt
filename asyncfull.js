const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'Alvaro334',
  host: 'Ojumo',
  port: 5432,
  database: 'test'
});

async function execute() {
  try {
    await client.connect();
    console.log('Connected successfully');
    const { rows } = await client.query('select * from cars');
    console.table(rows);
  } catch (error) {
    console.log('something went wrong');
  } finally {
    await client.end();
    console.log('successfully disconnected');
  }
}

execute();
