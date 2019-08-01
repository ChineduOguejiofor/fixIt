const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'Alvaro334',
  // host: 'Ojumo',
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
    await client.query(queryText2);
    await client.query(createUsersTable);
    await client.query(createRequestTable);
    console.log('table created');

    await client.query('COMMIT');
  } catch (error) {
    console.log('Failed on Error');
    console.log(error);

    await client.query('ROLLBACK');
  } finally {
    await client.end();
    console.log('Cleaned');
  }
}
const queryText1 = 'DROP TABLE IF EXISTS users';
const queryText2 = 'DROP TABLE IF EXISTS requests';
const createUsersTable = ` CREATE TABLE IF NOT EXISTS
      users(
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        avatar VARCHAR(128),
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP
      )`;

const createRequestTable = ` CREATE TABLE IF NOT EXISTS
      requests(
        id BIGSERIAL PRIMARY KEY,
        body VARCHAR(128) NOT NULL,
        image VARCHAR(128),
        user_id BIGINT REFERENCES users(id),
        is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
        is_approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP
      )`;

// id, body, image, user_id, is_resolved;
