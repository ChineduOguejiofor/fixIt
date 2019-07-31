const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'Alvaro334',
  host: 'Ojumo',
  port: 5432,
  database: 'test'
});
execute();
async function execute() {
  try {
    await client.connect();
    console.log('Connected successfully');
    await client.query('BEGIN');
    await client.query(queryText1);
    await client.query(queryText);
    console.log('table created');

    await client.query('COMMIT');
  } catch (error) {
    console.log('Failed on Error');
    await client.query('ROLLBACK');
  } finally {
    await client.end();
    console.log('Cleaned');
  }
}
const queryText1 = 'DROP TABLE IF EXISTS mydata';
const queryText = ` CREATE TABLE IF NOT EXISTS
      mydata(
        id BIGSERIAL PRIMARY KEY,
        success VARCHAR(128) NOT NULL,
        low_point VARCHAR(128) NOT NULL,
        take_away VARCHAR(128) NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP
      )`;
