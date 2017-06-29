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
    resave: true,
    saveUninitialized: true,
    cookies: {
      maxAge: 600000
    }
  })
);

//GLOBAL VARIABLES
var mySession;
var userGuesses;
var guessCount = 8;
var incorrectGuesses = [];
var didYouWin = " ";
var winnerMsg = "";
var randomWord = words[selectRandomWord(0, words.length)];
console.log("random word", randomWord);
var blankSpaces = createBlankSpaces();

//ROUTES
app.get("/", function(req, res) {
  if (guessCount == 0) {
    return res.redirect("/youLost");
  }
  mySession = req.session;
  res.render("index", {
    blankSpaces: blankSpaces,
    errorMsg: req.session.errorMsg,
    incorrectGuesses: incorrectGuesses,
    guessCount: guessCount,
    winner: didYouWin,
    winnerMsg: winnerMsg
  });
});

app.get("/youLost", function(req, res) {
  gameRestart();
  res.render("youLost");
});

app.post("/", function(req, res) {
  userGuesses = req.body.guess;
  checkValidityOfUserGuess(req);
  handleUserGuess();

  if (incorrectGuesses == 0) {
    didYouWin = false;
  }
  return res.redirect("/");
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
    x.push("_");
  }
  return x;
}

function checkValidityOfUserGuess(request) {
  if (userGuesses.length > 1) {
    request.session.errorMsg = "Please enter ONLY a SINGLE letter";
    //do something bad
  } else if (isNaN(userGuesses)) {
    request.session.errorMsg = "";
    //do something good
  } else {
    request.session.errorMsg = "Please enter ONLY a LETTER";
    //do something bad becouse this is a number
  }
}

function handleUserGuess() {
  let isWrong = true;
  for (var i = 0; i < randomWord.length; i++) {
    if (randomWord.split("")[i] === userGuesses) {
      //correct guess
      isWrong = false;
      blankSpaces[i] = userGuesses;
    }
  }
  if (isWrong) {
    incorrectGuesses.push(userGuesses + " ");
    guessCount--;
  }
  if (randomWord == blankSpaces.join("")) {
    winnerMsg = "You fuggin' won brah!";
  }
}

function gameRestart(params) {
  mySession;
  userGuesses;
  guessCount = 8;
  incorrectGuesses = [];
  didYouWin = " ";
  randomWord = words[selectRandomWord(0, words.length)];
  console.log("random word", randomWord);
  blankSpaces = createBlankSpaces();
}

//get page to reset after word is solved

//Notes
//get asks for information from the server and passes it to the front-end(for the user)
//post asks for information from the front-end(from the user) and passes it to the back-end(server)
