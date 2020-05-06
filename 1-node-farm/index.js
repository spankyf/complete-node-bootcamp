const fs = require('fs');
const path = require('path');
// const process require('process');
// console.log(process.cwd())

// read a file
const textIn = fs.readFileSync(path.join('starter','txt','input.txt'), 'utf-8');
// console.log(textIn);

// write to file
const textOut = `This is what we know about the avocado: ${textIn}. \nCreaated on ${Date.now()}`;
fs.writeFileSync(path.join('starter','txt','output.txt'), textOut);
console.log('File has been written');