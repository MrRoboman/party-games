class Box extends Body {
  constructor(x, y, w, h, options = {}) {
    super(x, y)

    this.particles = []
    this.jetRotation = -PI / 2

    this.thrust = 0.012
    this.thrustLateral = 0.005
    this.thrustRotate = 0.0015

    // this.buttons = {
    //   up: 0,
    //   left: 0,
    //   right: 0,
    // rotateRight: 0,
    // rotateLeft: 0,
    // }
    this.buttons = [0, 0, 0]
    this.vectorInput = { magnitude: 0, angle: 0 }
    // this.vectorInputFactor = 0.01

    this.w = w
    this.h = h

    this.body = Matter.Bodies.circle(x, y, w / 2, options)
    Matter.World.add(world, this.body)
  }

  input() {
    // const mult = 1 // for testing
    // this.up(this.buttons[0] * mult)
    // this.left(this.buttons[1] * mult)
    // this.right(this.buttons[2] * mult)

    // this.rotateRight(this.buttons.rotateRight * mult)
    // this.rotateLeft(this.buttons.rotateLeft * mult)

    const { angle, magnitude } = this.vectorInput
    const force = p5.Vector.fromAngle(angle)
    force.mult(magnitude)
    force.mult(this.thrust)
    Matter.Body.applyForce(this.body, this.body.position, force)

    this.jetRotation = angle || this.jetRotation
  }

  setVectorInput(vectorInput) {
    this.vectorInput = vectorInput

    // if (Matter.Vector.magnitudeSquared(this.vectorInput) > 1) {
    //   this.vectorInput = Matter.Vector.normalise(this.vectorInput)
    // }
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

  rotateRight(multiplier = 1) {
    let forcePosition = {
      x: this.x - this.w / 2,
      y: this.y,
    }
    Matter.Body.applyForce(this.body, forcePosition, {
      x: 0,
      y: -this.thrustRotate * multiplier,
    })

    forcePosition = {
      x: this.x + this.w / 2,
      y: this.y,
    }
    Matter.Body.applyForce(this.body, forcePosition, {
      x: 0,
      y: this.thrustRotate * multiplier,
    })
  }

  rotateLeft(multiplier = 1) {
    let forcePosition = {
      x: this.x - this.w / 2,
      y: this.y,
    }
    Matter.Body.applyForce(this.body, forcePosition, {
      x: 0,
      y: this.thrustRotate * multiplier,
    })

    forcePosition = {
      x: this.x + this.w / 2,
      y: this.y,
    }
    Matter.Body.applyForce(this.body, forcePosition, {
      x: 0,
      y: -this.thrustRotate * multiplier,
    })
  }

  show() {
    if (!this.isActive) return

    fill(this.fill)
    stroke(0)
    strokeWeight(2)

    push()
    translate(this.x, this.y)

    push()
    rotate(this.angle)
    circle(0, 0, this.w / 2)

    strokeWeight(3)
    const count = 6
    for (let i = 0; i < count; i++) {
      const angle = map(i, 0, count, 0, TWO_PI)
      const x = (cos(angle) * this.w) / 2
      const y = (sin(angle) * this.w) / 2
      line(0, 0, x, y)
    }

    fill(100)
    circle(0, 0, this.w * 0.25)

    pop()

    rotate(this.jetRotation)
    // Flame
    const flameOffset = randomGaussian() * 2
    strokeWeight(3)
    fill('red')
    beginShape()
    vertex(-this.w * 0.25, -this.h * 0.16)
    vertex(-this.w * 0.7 * this.vectorInput.magnitude, flameOffset)
    vertex(-this.w * 0.25, this.h * 0.16)
    endShape(CLOSE)
    fill('yellow')
    beginShape()
    vertex(-this.w * 0.25, -this.h * 0.1)
    vertex(-this.w * 0.45 * this.vectorInput.magnitude, flameOffset)
    vertex(-this.w * 0.25, this.h * 0.1)
    endShape(CLOSE)

    // Jet
    fill(150)
    beginShape()
    vertex(-this.w * 0.25, -this.h * 0.2)
    vertex(this.w * 0.35, -this.h * 0.05)
    vertex(this.w * 0.35, this.h * 0.05)
    vertex(-this.w * 0.25, this.h * 0.2)
    endShape(CLOSE)
    pop()
  }
}
