const http = require('http');
const fs = require('fs');
const url = require('url');

// Building a simple server
const server = http.createServer((req, res) =>{
    console.log(req.url);
    res.end('Hello from the server!');
});

server.listen(8000,'127.0.0.1',() => {
    console.log('Listening for requests on port 8000');
});