const fs = require('fs');
const path = require('path');

// // Blockinng,synchronous way
// const textIn = fs.readFileSync(path.join('starter','txt','input.txt'), 'utf-8');
// // console.log(textIn);

// // write to file
// const textOut = `This is what we know about the avocado: ${textIn}. \nCreaated on ${Date.now()}`;
// fs.writeFileSync(path.join('starter','txt','output.txt'), textOut);
// console.log('File has been written');

// read a file in async way
fs.readFile(path.join('starter','txt','start.txt'), 'utf-8',(err, data1) => {
    fs.readFile(path.join('starter','txt', `${data1}`+'.txt'), 'utf-8',(err, data2) => {
        console.log('Should be here');
        console.log(path.join('starter','txt','start.txt'));
        console.log(data2)

    });
});

console.log('Process underway...');