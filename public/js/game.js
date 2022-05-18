let world, engine
let bodies = []

function setup() {
  createCanvas(800, 600)
  rectMode(CENTER)

  engine = Matter.Engine.create()
  world = engine.world

  buildWalls()

  // Box
  addBody(new Box(100, 100, 100, 100))
  // Box
  addBody(new Box(150, 250, 100, 100))
}

function draw() {
  Matter.Engine.update(engine)

  background(120)
  drawBodies()
}

function addBody(newBody) {
  bodies.push(newBody)
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
