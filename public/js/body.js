class Body {
  constructor() {
    // this.w = w
    // this.h = h
    // this.body = Matter.Bodies.rectangle(x, y, w, h, options)
    // Matter.World.add(world, this.body)
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
