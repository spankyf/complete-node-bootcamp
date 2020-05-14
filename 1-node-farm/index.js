const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

// Building a simple server

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = temp.replace(/{%IMAGE%}/g, product.image);
  output = temp.replace(/{%PRICE%}/g, product.price);
  output = temp.replace(/{%FROM%}/g, product.from);
  output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = temp.replace(/{%DESCRIPTION%}/g, product.quantity);
  output = temp.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = temp.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const tempOverview = fs.readFileSync(
  path.join(`${__dirname}`, "starter", "templates", "template-overview.html"),
  "utf-8"
);
const tempProduct = fs.readFileSync(
  path.join(`${__dirname}`, "starter", "templates", "template-product.html"),
  "utf-8"
);
const tempCard = fs.readFileSync(
  path.join(`${__dirname}`, "starter", "templates", "template-card.html"),
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  // this is the OVERVIEW

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  } else if (pathName === "/product") {
    // this is the PRODUCT
    res.end("This is the product");
  } else if (pathName === "/api") {
    // API
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    // NOT FOUND
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>This page could not be found</h1>");
  }

  // res.end('Hello from the server!');
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening for requests on port 8000");
});
