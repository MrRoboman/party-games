class Wall {
  constructor(x, y, w, h, options = {}) {
    this.w = w
    this.h = h

    options = {
      isStatic: true,
      ...options,
    }
    this.body = Matter.Bodies.rectangle(x, y, w, h, options)
    Matter.World.add(world, this.body)
  }

  get x() {
    return this.body.position.x
  }

  get y() {
    return this.body.position.y
  }

  get angle() {
    return this.body.angle
  }

  set angle(newAngle) {
    Matter.Body.setAngle(this.body, newAngle)
  }

  show() {
    fill('pink')
    stroke(0)
    strokeWeight(2)

    push()
    translate(this.x, this.y)
    rotate(this.angle)
    rect(0, 0, this.w, this.h)
    pop()
  }
}
