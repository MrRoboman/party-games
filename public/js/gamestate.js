class GameState {
  start() {}
  input() {}
  update() {}
  draw() {
    background(80)
    drawBodies()
    timer.show()
    scores.forEach(score => score.show())
  }
  end() {}
}
