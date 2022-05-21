class GameStateStart extends GameState {
  start() {
    ball && ball.reset(width / 2, height / 2 - 200)
    players.forEach((player, idx) => {
      const { x, y } = config.players[idx].startPosition
      console.log(width * x, height * y) // eslint-disable-line
      player.reset(width * x, height * y)
    })
    setTimeout(() => changeState(new GameStatePlay()), 1000)
  }
}
