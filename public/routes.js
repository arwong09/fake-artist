var path = require('path')
const Game = require(path.join(__dirname+'/game.js'))
const User = require(path.join(__dirname+'/user.js'))
var Rx = require('rxjs/Rx')

var game = new Game()
var subject = new Rx.Subject()

function setupRoutes(app) {
  app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname+'/play.html'))
  })

  app.post('/join', function (req, res, next) {
    if (!game.phase === 0) {
      res.json({ status: "error", message: "The game is already in progress. Please wait for a new game to join."})
      return
    }

    console.log(req.body.username)

    var newPlayer = new User(req.body.username)
    var addPlayerResponse = game.addPlayer(newPlayer)

    subject.next(newPlayer.username)
  })

// Event Stream
  app.get('/start', function (req, res, next) {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });

    subject.subscribe({
      next: (username) => res.write('data: ' + username + '\n\n')
    })
  })
}

module.exports = setupRoutes