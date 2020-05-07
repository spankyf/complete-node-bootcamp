const http = require('http');
const fs = require('fs');
const url = require('url');

// Building a simple server

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) =>{
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the overview');
    }   else if (pathName === '/product') {
        res.end('This is the product');
        
        }   
        else if (pathName === '/api') {
            res.writeHead(200, { 'Content-type': 'application/json'});
            res.end(data);
        }
        else {
        res.writeHead(404,{
            'Content-type' : 'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>This page could not be found</h1>');
    }

    // res.end('Hello from the server!');
});

server.listen(8000,'127.0.0.1',() => {
    console.log('Listening for requests on port 8000');
});