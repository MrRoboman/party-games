let socket

let world, engine
let bodies = []
let body
let ball

function setupSocket() {
  socket = io()

  socket.emit('gameClient')

  socket.on('buttons', ([up, left, right]) => {
    body.buttons.up = up ? 1 : 0
    body.buttons.left = left ? 1 : 0
    body.buttons.right = right ? 1 : 0
  })
  // socket.on('currentPlayers', players => {
  //   console.log({ players }) // eslint-disable-line
  //   for (id in players) {
  //     const player = players[id]
  //     circle(player.x, player.y, 50)
  //   }
  // })
}

function setup() {
  setupSocket()

  createCanvas(800, 600)
  rectMode(CENTER)
  ellipseMode(RADIUS)

  engine = Matter.Engine.create()
  world = engine.world

  engine.gravity.scale = 0.0007

  buildWalls()

  // Box
  body = addBody(
    new Box(100, 100, 100, 100, {
      // inertia: Infinity,
      // restitution: 1,
      // friction: 0,
      // frictionAir: 0,
      // frictionStatic: 0,
    }),
  )
  // Box
  // addBody(new Box(175, 250, 100, 100))
  ball = addBody(
    new Ball(700.4150010673924, height / 2 - 200, 50, {
      inertia: Infinity,
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.0005,
    }),
  )
  // ball.body.restitution = 1
  // ball.body.mass = 0.0000000001
  // body.body.restitution = 1
  // Matter.Body.setMass(body, 100)
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

  const options = {
    isStatic: true,
    // friction: 0.2,
    // restitution: 1,
  }

  // Left Wall
  addBody(new Box(halfThickness, height / 2, thickness, height, options))

  // Right Wall
  addBody(
    new Box(width - halfThickness, height / 2, thickness, height, options),
  )

  // Ground
  addBody(new Box(width / 2, height - halfThickness, width, thickness, options))

  // Ceiling
  addBody(new Box(width / 2, halfThickness, width, thickness, options))

  // Left Ramp
  addBody(
    new Box(100, height - 100, 400, thickness, { ...options, angle: PI / 4 }),
  )

  // Right Ramp
  addBody(
    new Box(width - 100, height - 100, 400, thickness, {
      ...options,
      angle: -PI / 4,
    }),
  )
}

function keyPressed() {
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
