class Box {
  constructor(x, y, w, h, options = {}) {
    this.thrust = 0.012
    this.thrustLateral = 0.005

    this.buttons = {
      up: 0,
      left: 0,
      right: 0,
    }

    this.w = w
    this.h = h

    this.body = Matter.Bodies.rectangle(x, y, w, h)
    Matter.World.add(world, this.body)

    for (const key in options) {
      this.body[key] = options[key]
    }
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

  input() {
    this.up(this.buttons.up)
    this.left(this.buttons.left)
    this.right(this.buttons.right)
  }

  up(multiplier = 1) {
    Matter.Body.applyForce(this.body, this.body.position, {
      x: 0,
      y: -this.thrust * multiplier,
    })
  }

  left(multiplier = 1) {
    Matter.Body.applyForce(this.body, this.body.position, {
      x: -this.thrustLateral * multiplier,
      y: 0,
    })
  }

  right(multiplier = 1) {
    Matter.Body.applyForce(this.body, this.body.position, {
      x: this.thrustLateral * multiplier,
      y: 0,
    })
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
