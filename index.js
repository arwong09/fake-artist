/*
 *  Classes
 */

// Game
class Game {
  constructor () {
    this.players = {}
    this.phase = 0
    this.host = null
    this.wordmaster = null
  }

  addPlayer(user) {
    var username = user.username

    if (this.players[username]) {
      return {
        status: "error",
        message: "That player already exists. Choose a different username."
      }
    } else {
      if (Object.keys(this.players).length === 0) {
        this.host = user
      }
      this.players[username] = user

      return {
        status: "success",
        message: "Successfully joined the game."
      }
    }
  }

  selectWordmaster() {
    var randomIndex = Math.floor(Math.random(0) * this.players.length)
    var selectedUsername = Object.keys(this.players)[this.players[randomIndex]]
    this.wordmaster = this.players[selectedUsername]
  }

  startNextPhase() {
    this.phase = 1
    this.selectWordmaster()
  }
}

// User
class User {
  constructor(username) {
    this.username = username
  }
}


/*
 * Server
 */

var express = require('express'),
  path = require('path'),
  app = express(),
  port = 3000

app.use(express.json()) // for parsing application/json

// var game = new Game()

// Routes
app.post('/join', function (req, res, next) {
  if (!game.phase === 0) {
    res.json({ status: "error", message: "The game is already in progress. Please wait for a new game to join."})
    return
  }

  var payload = JSON.parse(req.body)

  var newPlayer = new User(payload.username)
  var addPlayerResponse = game.addPlayer(newPlayer)

  res.json(addPlayerResponse)
})

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname+'/public/play.html'))
})

// Event Stream
app.get('/start', function (req, res, next) {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });

  res.write('data: 10000\n\n')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))