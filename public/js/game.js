let config = {
  arena: {
    ceilingThickness: 50,
    floorThickness: 50,
    goalThickness: 50,
    goalWidth: 300,
    rampThickness: 200,
    wallThickness: 200,
  },
}

let socket

// Game States
const GAME_STATE_START = 1
const GAME_STATE_PLAY = 2
const GAME_STATE_GOAL = 3
let gameState

let world, engine
let bodies = []
let arenaBods = []
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
}

function setup() {
  setupSocket()

  const w = windowWidth
  const h = (w * 9) / 16
  createCanvas(w, h)
  rectMode(CENTER)
  ellipseMode(RADIUS)

  engine = Matter.Engine.create()
  world = engine.world

  engine.gravity.scale = 0.0007

  createArenaBodies()

  // Box
  body = addBody(
    new Box(
      width / 4,
      height - config.arena.floorThickness - 100,
      100,
      100,
      {},
    ),
  )
  // Box
  ball = addBody(
    new Ball(width / 2, height / 2 - 200, 50, {
      inertia: Infinity,
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.0005,
    }),
  )

  changeState(new GameStateStart())
}

function draw() {
  gameState.input()
  gameState.update()
  gameState.draw()
  // body.input()

  // Matter.Engine.update(engine)

  // background(120)
  // drawBodies()
}

function changeState(nextState) {
  gameState && gameState.end()
  gameState = nextState
  gameState.start()
}

function addBody(newBody) {
  bodies.push(newBody)
  return newBody
}

function drawBodies() {
  arenaBods.forEach(body => body.show())
  bodies.forEach(body => body.show())
}

function createArenaBodies() {
  const {
    ceilingThickness,
    floorThickness,
    goalThickness,
    goalWidth,
    rampThickness,
    wallThickness,
  } = config.arena

  // Build Ramps
  ;[
    [wallThickness, ceilingThickness],
    [wallThickness, height - floorThickness],
    [width - wallThickness, ceilingThickness],
    [width - wallThickness, height - floorThickness],
  ].forEach(([x, y]) => {
    const ramp = new Wall(x, y, rampThickness, rampThickness, { angle: PI / 4 })
    // bodies.push(ramp)
    // arenaBodies.ramps.push(ramp)
    arenaBods.push(ramp)
  })

  // Build Goals
  ;[
    [goalThickness / 2, height / 2],
    [width - goalThickness / 2, height / 2],
  ].forEach(([x, y]) => {
    const goal = new Wall(x, y, goalThickness, goalWidth)
    // bodies.push(goal)
    // arenaBodies.goals.push(goal)
    arenaBods.push(goal)
  })

  // The walls are rectangles in the for corners of the screen.
  // The space between the top and bottom rects is the goalWidth.
  const wallHeight = (height - goalWidth) / 2

  // Build Walls
  ;[
    [wallThickness / 2, wallHeight / 2],
    [wallThickness / 2, height - wallHeight / 2],
    [width - wallThickness / 2, wallHeight / 2],
    [width - wallThickness / 2, height - wallHeight / 2],
  ].forEach(([x, y]) => {
    const wall = new Wall(x, y, wallThickness, wallHeight)
    // bodies.push(wall)
    // arenaBodies.walls.push(wall)
    arenaBods.push(wall)
  })

  // Build Ceiling
  arenaBods.push(
    new Wall(width / 2, ceilingThickness / 2, width, ceilingThickness),
  )

  // Build Floor
  arenaBods.push(
    new Wall(width / 2, height - floorThickness / 2, width, floorThickness),
  )
}

function removeArenaBodies() {
  arenaBods.forEach(body => body.remove())
  arenaBods = []
}

// Receive newArenaConfig from Socket
function updateArenaBodies(newArenaConfig) {
  config.arena = newArenaConfig
  removeArenaBodies()
  createArenaBodies()
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

  // Enter
  if (keyCode === ENTER) {
    // This tests the updateArena socket function
    updateArenaBodies({
      ceilingThickness: 50,
      floorThickness: 50,
      goalThickness: 50,
      goalWidth: 300,
      rampThickness: 400,
      wallThickness: 500,
    })
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
