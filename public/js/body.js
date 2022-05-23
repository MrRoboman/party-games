class Body {
  constructor(x, y) {
    this.startPosition = { x, y }
    this.fill = 'mistyrose'
    this.isActive = true
  }

  reset(x, y) {
    Matter.Body.setPosition(this.body, { x, y })
    Matter.Body.setAngle(this.body, 0)
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(this.body, 0)
  }

  set active(_active) {
    if (!this.isActive && _active) {
      Matter.World.add(world, this.body)
      this.reset(this.startPosition.x, this.startPosition.y)
    } else if (this.active && !_active) {
      Matter.World.remove(world, this.body)
    }
    this.isActive = _active
  }

  get active() {
    return this.isActive
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
    if (!this.isActive) return

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
