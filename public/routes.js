var path = require('path')
const Game = require(path.join(__dirname+'/game.js'))
const User = require(path.join(__dirname+'/user.js'))
const Topic = require(path.join(__dirname+'/topic.js'))
var Rx = require('rxjs/Rx')

var game = new Game()
var messageEventStream = new Rx.Subject()
var routeEventStream = new Rx.Subject()

function setupRoutes(app) {
  app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname+'/play.html'))
  })

  app.get('/hosting', function (req, res, next) {
    res.sendFile(path.join(__dirname+'/hosting.html'))
  })

  app.get('/sourcing', function (req, res, next) {
    res.sendFile(path.join(__dirname+'/sourcing.html'))
  })

  app.post('/join', function (req, res, next) {
    if (!game.phase === 0) {
      res.json({ status: "error", message: "The game is already in progress. Please wait for a new game to join."})
      return
    }

    var newPlayer = new User(req.body.username)
    var addPlayerResponse = game.addPlayer(newPlayer)

    var players = Object.keys(game.players).join(', ')
    messageEventStream.next(players)

    if (game.host = newPlayer) {
      routeEventStream.next('/hosting')
    }
  })

  app.post('/topic', function (req, res, next) {
    if (!game.phase === 1) {
      res.json({ status: "error", message: "The game is not in the sourcing phase!"})
      return
    }

    var newTopic = new Topic(req.body.category, req.body.topic)
    game.addTopic(req.body.username, newTopic)

    if (game.host = newPlayer) {
      routeEventStream.next('/hosting')
    }
  })

  app.post('/start', function (req, res, next) {
    game.startSourcePhase()
    routeEventStream.next('/sourcing')
  })

// Event Stream
  app.get('/start', function (req, res, next) {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });

    messageEventStream.subscribe({
      next: (username) => res.write("data:" + JSON.stringify({ type: "message", value: username,  }) + "\n\n")
    })

    routeEventStream.subscribe({
      next: (routePath) => res.write("data:" + JSON.stringify({ type: "route", value: routePath,  }) + "\n\n")
    })
  })
}

module.exports = setupRoutes