class GameStateGameOver extends GameState {
  start() {
    // Flash the scores and wait for user input?
    // If everyone holds the up button then the game starts.
    setTimeout(() => changeState(new GameStateStart()), 1500)
  }
}
