const fs = require("fs");
const path = require("path");

let templatePath = path.join(
  `${__dirname}`,
  "starter",
  "templates",
  "template-overview.html"
);

fs.access(templatePath, fs.constants.F_OK, (err) => {
  console.log(`${templatePath} ${err ? "does not exist" : "exists"}`);
});

const tempOverview = fs.readFileSync(templatePath, "utf-8");
