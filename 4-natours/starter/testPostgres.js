const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgres://ovkqqiatxiqyza:99d58e78af22b2d82786bb0d713c48a753e4c625ef19257d1beb3fd0c2e692b7@ec2-54-247-118-139.eu-west-1.compute.amazonaws.com:5432/d938vm8og3qm59',
  ssl: { rejectUnauthorized: false }
});
client.connect();
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  client.end();
});
