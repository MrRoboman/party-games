class GameStateStart extends GameState {
  start() {
    ball && ball.reset(width / 2, height / 2 - 200)
    players.forEach((player, idx) => {
      const { x, y } = player.startPosition
      console.log(x, y) // eslint-disable-line
      player.reset(x, y)
    })
    setTimeout(() => changeState(new GameStatePlay()), 1000)
  }
}
