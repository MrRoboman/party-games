class GameStatePlay extends GameState {
  // start() {
  //   ball.setPosition(width / 2, height / 2 - 200)
  //   setTimeout(() => changeState(new GameStatePlay()), 3000)
  // }
  input() {
    body.input()
  }
  update() {
    Matter.Engine.update(engine) // use deltaTime?
  }
}
