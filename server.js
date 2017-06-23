const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

//Set View Engine
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

//MIDDLEWARE
app.use("/", express.static("./public"));

//ROUTES
app.get("/", function(req, res) {
  res.render("index");
});

app.listen(port, function() {});
console.log("Your port is successfully running on port ", port);
