class Wall extends Body {
  constructor(x, y, w, h, options = {}) {
    super()

    this.w = w
    this.h = h

    options = {
      isStatic: true,
      ...options,
    }

    this.body = Matter.Bodies.rectangle(x, y, w, h, options)
    Matter.World.add(world, this.body)
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

  remove() {
    Matter.World.remove(world, this.body)
  }
}
