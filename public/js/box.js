class Box extends Body {
  constructor(x, y, w, h, options = {}) {
    super()

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

    this.w = w
    this.h = h

    this.body = Matter.Bodies.rectangle(x, y, w, h, options)
    Matter.World.add(world, this.body)
  }

  input() {
    const mult = 1 // for testing
    this.up(this.buttons[0] * mult)
    this.left(this.buttons[1] * mult)
    this.right(this.buttons[2] * mult)
    // this.rotateRight(this.buttons.rotateRight * mult)
    // this.rotateLeft(this.buttons.rotateLeft * mult)
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
