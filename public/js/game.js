let world, engine
let bodies = []
let body

function setup() {
  createCanvas(800, 600)
  rectMode(CENTER)

  engine = Matter.Engine.create()
  world = engine.world

  buildWalls()

  // Box
  body = addBody(new Box(100, 100, 100, 100))
  // Box
  // addBody(new Box(175, 250, 100, 100))
}

function draw() {
  body.input()

  Matter.Engine.update(engine)

  background(120)
  drawBodies()
}

function addBody(newBody) {
  bodies.push(newBody)
  return newBody
}

function drawBodies() {
  bodies.forEach(body => body.show())
}

function buildWalls() {
  // Ground, Walls, Ceiling
  const thickness = 50
  const halfThickness = thickness / 2

  // Left Wall
  addBody(
    new Box(halfThickness, height / 2, thickness, height, {
      isStatic: true,
    }),
  )

  // Right Wall
  addBody(
    new Box(width - halfThickness, height / 2, thickness, height, {
      isStatic: true,
    }),
  )

  // Ground
  addBody(
    new Box(width / 2, height - halfThickness, width, thickness, {
      isStatic: true,
    }),
  )

  // Ceiling
  addBody(
    new Box(width / 2, halfThickness, width, thickness, {
      isStatic: true,
    }),
  )
}

function keyPressed() {
  console.log({ keyCode }) // eslint-disable-line
  if (keyCode === UP_ARROW) {
    body.buttons.up += 1
  }
  if (keyCode === LEFT_ARROW) {
    body.buttons.left += 1
  }
  if (keyCode === RIGHT_ARROW) {
    body.buttons.right += 1
  }

  // D
  if (keyCode === 68) {
    body.buttons.rotateRight += 1
  }

  // A
  if (keyCode === 65) {
    body.buttons.rotateLeft += 1
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    body.buttons.up -= 1
  }
  if (keyCode === LEFT_ARROW) {
    body.buttons.left -= 1
  }
  if (keyCode === RIGHT_ARROW) {
    body.buttons.right -= 1
  }

  // D
  if (keyCode === 68) {
    body.buttons.rotateRight -= 1
  }

  // A
  if (keyCode === 65) {
    body.buttons.rotateLeft -= 1
  }
}
