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

//Set View Engine
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

//MIDDLEWARE
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
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
var userGuesses;
var randomWord = words[selectRandomWord(0, words.length)];
console.log("random word", randomWord);
var blankSpaces = createBlankSpaces();

//ROUTES
app.get("/", function(req, res) {
  // console.log("session", req.session);
  mySession = req.session;
  res.render("index", { blankSpaces: blankSpaces });
});

app.post("/", function(req, res) {
  userGuesses = req.body.guess;
  console.log("userGuesses: ", userGuesses);
  console.log("guesses", req.body.guess);
  res.redirect("/");

  //is it a valid guess

  //is the guess in the word

  //add guess to blank spaces

  //add guess to incorrect guesses

  //keep track of incorrect guesses
});

app.listen(port, function() {});
console.log("Your port is successfully running on port ", port);

function selectRandomWord(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Functions

function createBlankSpaces() {
  var x = [];
  for (var i = 0; i < randomWord.length; i++) {
    x.push("_ ");
  }
  return x;
}

//Notes
//get asks for information from the server and passes it to the front-end(for the user)
//post asks for information from the front-end(from the user) and passes it to the back-end(server)

//Get the session up and running
//Generate random word - in the backend
//Parse the word up into letters
//Figure out how to display that into the front end
//Once in the front end:
//How can I display it without the user seeing it?
//How do I
//How can users input a letter, and if correct, show up in the "blank" spaces
//How can users input a letter, and if incorrect, show up in another area of the page

//Allow user to input letters,
