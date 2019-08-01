const { Client } = require('pg');
require('dotenv/config');
const client = new Client({
  user: process.env.dbUserName,
  password: process.env.myPass,
  port: 5432,
  database: process.env.dbName
});
const dropUsersTable = 'DROP TABLE IF EXISTS users';
const dropRequestTable = 'DROP TABLE IF EXISTS requests';
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

const createRequestTable = `CREATE TABLE IF NOT EXISTS
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

async function execute() {
  try {
    await client.connect();
    console.log('Connected successfully');
    await client.query('BEGIN');
    await client.query(dropRequestTable);
    await client.query(dropUsersTable);
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

execute();
