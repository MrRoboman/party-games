class GameStateGameOver extends GameState {
  start() {
    this.lastTimeNotEveryoneWasPushingUp = Date.now()
  }

  input() {
    if (players.every(player => player.buttons[0])) {
      if (this.timeSinceEveryoneStartedPressingUp() >= 2000) {
        changeState(new GameStateStart())
      }
    } else {
      this.lastTimeNotEveryoneWasPushingUp = Date.now()
    }
  }

  timeSinceEveryoneStartedPressingUp() {
    return Date.now() - this.lastTimeNotEveryoneWasPushingUp
  }
}
