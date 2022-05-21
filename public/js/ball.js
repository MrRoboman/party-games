class Ball extends Body {
  constructor(x, y, r, options = {}) {
    super()

    this.r = r

    this.body = Matter.Bodies.circle(x, y, r, options)
    Matter.World.add(world, this.body)
  }

  show() {
    fill(this.fill)
    stroke(0)
    strokeWeight(2)

    push()
    translate(this.x, this.y)
    circle(0, 0, this.r)
    pop()
  }
}
