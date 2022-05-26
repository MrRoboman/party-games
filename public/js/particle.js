// Not used yet
class Particle {
  constructor(position, velocity) {
    this.position = position
    this.velocity = velocity
    this.alpha = 255
  }

  show() {
    this.position.add(this.velocity)
    this.alpha -= 1
    rect(255, 0, 0, this.alpha)
  }
}
