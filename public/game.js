module.exports = class Game {
  constructor () {
    this.players = {}
    this.phase = 0
    this.host = null
    this.topics = {}
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

  addTopic(username, topic) {
    this.topics[username] = topic
    if (Object.keys(this.topics).length == this.players.length) {
      this.phase = 2
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

  startSourcePhase() {
    this.phase = 1
  }
}