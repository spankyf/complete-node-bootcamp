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
    if (err) return console.log('ITs Broken!!!');
    
    fs.readFile(path.join('starter','txt', `${data1}`+'.txt'), 'utf-8',(err, data2) => {
        // console.log(data2);
        fs.readFile(path.join('starter','txt','append.txt'), 'utf-8',(err, data3) => {
            // console.log(data3);

            fs.writeFile('./txt/final.txt',`${data2}
            ${data3}`,'utf-8',err => {
                console.log('');
                console.log('Your file has been written');
            });

        });

    });
});

console.log('Process underway...');