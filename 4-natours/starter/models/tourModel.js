const pg = require('pg');

// https://dev.to/gajus/dynamically-generating-sql-queries-using-node-js-2c1g
// 'CREATE TABLE tour (name VARCHAR(20) NOT NULL,rating REAL DEFAULT 9.99, price REAL NOT NULL) VALUES (wrds, 2.5, 4.5) ;'
// 'INSERT INTO tour VALUES ('something', 2.5,4.5);'
// const queryAddTour =
