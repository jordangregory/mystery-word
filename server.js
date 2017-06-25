const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const fs = require("fs");
const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toLowerCase()
  .split("\n");

var randomWord = selectRandomWord(0, words.length);
console.log("random word", randomWord);

console.log(words.length);
//Set View Engine
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

//MIDDLEWARE
app.use("/", express.static("./public"));
app.use(
  session({
    secret: "ham sandwich",
    resave: false,
    cookies: {
      maxAge: 600000
    }
  })
);

//GLOBAL VARIABLES
var mySession;

//ROUTES
app.get("/", function(req, res) {
  console.log("session", req.session);
  mySession = req.session;
  res.render("index", { session: mySession });
});

app.post("/"), function(req, res) {
  res.redirect("index");
};

app.listen(port, function() {});
console.log("Your port is successfully running on port ", port);

function selectRandomWord(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//Get the session up and running
//Generate random word - in the backend FUCKING DONE
//Parse the word up into letters
//Figure out how to display that into the front end
//Once in the front end:
//How can I display it without the user seeing it?
//How do I
//How can users input a letter, and if correct, show up in the "blank" spaces
//How can users input a letter, and if incorrect, show up in another area of the page

//Allow user to input letters,
