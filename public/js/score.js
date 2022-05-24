class Score {
  constructor(fill, position) {
    this.fill = fill
    this.position = position
    this.score = 0
  }

  show() {
    textSize(260)
    textAlign(CENTER, TOP)
    fill(this.fill)

    text(this.score, this.position.x, this.position.y)
  }
}
