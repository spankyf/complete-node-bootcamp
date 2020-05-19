const superagent = require("superagent");
const fs = require("fs");
console.log("hi dean");

fs.readFile(`${__dirname}/dog.txt`, "utf8", (err, data) => {
  console.log(`Breed: ${data}`);
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile("dog-image.txt", res.body.message, (err) => {
        console.log("Random dog image saved to file");
      });
    });
});
