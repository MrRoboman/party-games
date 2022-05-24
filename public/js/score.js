class Score {
  constructor(fill, position, side) {
    this.fill = fill
    this.score = 0

    this.textSizeSmall = 260
    this.textSizeBig = 800
    this.textSize = this.textSizeSmall

    this.homePosition = { ...position }
    this.grownPosition = { ...position }
    this.grownPosition.x += 300 * side
    this.position = { ...position }
  }

  grow(startTime, endTime) {
    this.textSize = map(
      Date.now(),
      startTime,
      endTime,
      this.textSizeSmall,
      this.textSizeBig,
      true,
    )

    this.position.x = map(
      Date.now(),
      startTime,
      endTime,
      this.homePosition.x,
      this.grownPosition.x,
      true,
    )

    this.position.y = map(
      Date.now(),
      startTime,
      endTime,
      this.homePosition.y,
      this.grownPosition.y,
      true,
    )
  }

  shrink(startTime, endTime) {
    this.textSize = map(
      Date.now(),
      startTime,
      endTime,
      this.textSizeBig,
      this.textSizeSmall,
    )

    this.position.x = map(
      Date.now(),
      startTime,
      endTime,
      this.grownPosition.x,
      this.homePosition.x,
    )

    this.position.y = map(
      Date.now(),
      startTime,
      endTime,
      this.grownPosition.y,
      this.homePosition.y,
    )
  }

  show() {
    textSize(this.textSize)
    textAlign(CENTER, TOP)
    fill(this.fill)
    strokeWeight(8)

    text(this.score, this.position.x, this.position.y)
  }
}
