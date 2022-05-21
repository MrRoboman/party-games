class GameStateStart extends GameState {
  start() {
    ball && ball.reset(width / 2, height / 2 - 200)
    const { x, y } = config.players[0].startPosition
    if (box) {
      box.reset(width * x, height * y)
    }
    setTimeout(() => changeState(new GameStatePlay()), 1000)
  }
}
