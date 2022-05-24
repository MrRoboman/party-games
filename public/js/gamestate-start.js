class GameStateStart extends GameState {
  start() {
    if (timer.complete) {
      reset()
    }

    ball && ball.reset(width / 2, height / 2 - 200)

    players.forEach((player, idx) => {
      const { x, y } = player.startPosition
      player.reset(x, y)
    })
    setTimeout(() => changeState(new GameStatePlay()), 1000)
  }
}
