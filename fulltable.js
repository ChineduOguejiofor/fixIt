const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'Alvaro334',
  // host: 'Ojumo',
  port: 5432,
  database: 'test'
});

client
  .connect()
  .then(() => console.log('Connection successful'))
  .then(() => client.query('select * from cars'))
  .then(results => console.table(results.rows))
  .catch(e => console.log(e))
  .finally(() => client.end());

// client.query('SELECT * FROM User', (err, res) => {
//   console.log(err, res);
//   client.end();
// });
