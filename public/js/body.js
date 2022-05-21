class Body {
  constructor() {
    this.fill = 'mistyrose'
  }

  reset(x, y) {
    Matter.Body.setPosition(this.body, { x, y })
    Matter.Body.setAngle(this.body, 0)
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(this.body, 0)
  }

  get x() {
    return this.body.position.x
  }

  get y() {
    return this.body.position.y
  }

  setPosition(x, y) {
    Matter.Body.setPosition(this.body, { x, y })
  }

  get angle() {
    return this.body.angle
  }

  set angle(newAngle) {
    Matter.Body.setAngle(this.body, newAngle)
  }

  remove() {
    Matter.World.remove(world, this.body)
  }

  show() {
    fill(this.fill)
    stroke(0)
    strokeWeight(2)

    push()
    translate(this.x, this.y)
    rotate(this.angle)
    rect(0, 0, this.w, this.h)
    pop()
  }
}
