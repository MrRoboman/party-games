class GameStateGoal extends GameState {
  start() {
    setTimeout(() => changeState(new GameStateStart()), 1500)
  }
}
