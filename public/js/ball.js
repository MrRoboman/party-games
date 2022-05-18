class Ball {
  constructor(x, y, r, options = {}) {
    this.r = r

    this.body = Matter.Bodies.circle(x, y, r, options)
    Matter.World.add(world, this.body)

    // for (const key in options) {
    //   this.body[key] = options[key]
    // }
  }

  get x() {
    return this.body.position.x
  }

  get y() {
    return this.body.position.y
  }

  show() {
    fill('pink')
    stroke(0)
    strokeWeight(2)

    push()
    translate(this.x, this.y)
    circle(0, 0, this.r)
    pop()
  }
}
