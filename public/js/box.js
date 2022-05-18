class Box {
  constructor(x, y, w, h, options = {}) {
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
