class Box {
  constructor(x, y, w, h, options = {}) {
    this.thrust = 0.012
    this.thrustLateral = 0.005
    this.thrustRotate = 0.0015

    this.buttons = {
      up: 0,
      left: 0,
      right: 0,
      rotateRight: 0,
      rotateLeft: 0,
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
    this.rotateRight(this.buttons.rotateRight)
    this.rotateLeft(this.buttons.rotateLeft)
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
