class GameStateGameOver extends GameState {
  start() {
    this.startTime = Date.now()
    this.endTime = this.startTime + 300
    this.lastTimeNotEveryoneWasPushingUp = this.gameoverStartTime

    this.playersReady = false
  }

  input() {
    if (this.playersReady) {
      return
    }

    if (players.every(player => player.buttons[0])) {
      if (this.timeSinceEveryoneStartedPressingUp() >= 2000) {
        this.playersReady = true
        this.startTime = Date.now()
        this.endTime = this.startTime + 100
      }
    } else {
      this.lastTimeNotEveryoneWasPushingUp = Date.now()
    }
  }

  update() {
    scores.forEach(score => {
      if (!this.playersReady) {
        score.grow(this.startTime, this.endTime)
      } else {
        score.shrink(this.startTime, this.endTime)
      }
    })

    if (this.playersReady && Date.now() >= this.endTime) {
      changeState(new GameStateStart())
    }
  }

  timeSinceEveryoneStartedPressingUp() {
    return Date.now() - this.lastTimeNotEveryoneWasPushingUp
  }
}
