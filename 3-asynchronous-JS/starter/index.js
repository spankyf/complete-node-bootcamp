const superagent = require('superagent');
const fs = require('fs');

// fs.readFile(`${__dirname}/dog.txt`, "utf8", (err, data) => {
//   console.log(`Breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile("dog-image.txt", res.body.message, (err) => {
//         console.log("Random dog image saved to file");
//       });
//     });
// });

// fs.readFile(`${__dirname}/dog.txt`, "utf8", (err, data) => {
//   console.log(`Breed: ${data}`);
//   // the get method automatically returns a promise. In the beginnnig
//   // its a pending promise
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then(res => {
//       console.log(res.body.message)

//       fs.writeFile("dog-image.txt", res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log("Random dog image saved to file");
//       });
//     }).catch(err => {
//       console.log(err.message)
//     })
// });

// ***********************************************************************

// const readFilePro = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       if (err) reject('I could not find the file');
//       resolve(data);
//     });
//   });
// };

// const writeFilePro = (file, data) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(file, data, (err) => {
//       if (err) reject(console.log(err.message));
//       resolve('Random dog image saved to file');
//     });
//   });
// };

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro('dog-image.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog photo save to file');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// ************************************************************

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find the file');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(console.log(err.message));
      resolve('Random dog image saved to file');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-image.txt', res.body.message);
    console.log('Random dog pic saved');
  } catch (err) {
    console.log(err);
    throw err;
  }
  return '2: ready';
};

(async () => {
  try {
    console.log('1: will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3 done getting dog pcis');
  } catch (err) {
    console.log('Error!');
  }
})();
