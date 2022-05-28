class Ramp {
  constructor(x, y, r, count, rotation = 0) {
    this.position = createVector(x, y)
    this.radius = r
    this.size = 50
    this.bodies = []
    for (let i = 0; i < count; i++) {
      const angle = map(i, 0, count - 1, 0 + rotation, PI / 2 + rotation)
      const _x = x + cos(angle) * r
      const _y = y + sin(angle) * r
      const body = Matter.Bodies.rectangle(_x, _y, this.size, this.size, {
        isStatic: true,
      })
      Matter.Body.setAngle(body, angle)
      Matter.World.add(world, body)
      this.bodies.push(body)
    }
  }

  show() {
    stroke(0)
    strokeWeight(2)
    fill('mistyrose')
    this.bodies.forEach(body => {
      push()
      translate(body.position.x, body.position.y)
      rotate(body.angle)
      rect(0, 0, this.size, this.size)
      pop()
    })
  }
}
