let config = {
  arena: {
    ceilingThickness: 50,
    floorThickness: 50,
    goalThickness: 50,
    goalWidth: 300,
    rampThickness: 200,
    wallThickness: 200,
  },
  players: [{ startPosition: { x: 0.25, y: 0.8 } }],
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
let box
let ball
let leftGoal
let rightGoal

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
  box = addBody(
    new Box(
      width / 4,
      height - config.arena.floorThickness - 100,
      100,
      100,
      {},
    ),
  )
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
  ].forEach(([x, y], idx) => {
    const goal = new Wall(x, y, goalThickness, goalWidth)
    // bodies.push(goal)
    // arenaBodies.goals.push(goal)
    arenaBods.push(goal)

    if (idx === 0) {
      leftGoal = goal
    } else {
      rightGoal = goal
    }
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
  leftGoal = null
  rightGoal = null
}

// Receive newArenaConfig from Socket
function updateArenaBodies(newArenaConfig) {
  config.arena = newArenaConfig
  removeArenaBodies()
  createArenaBodies()
}

function isCollisionBetweenBodies({ bodyA, bodyB }, body1, body2) {
  const bodyOrder1 = bodyA === body1.body && bodyB === body2.body
  const bodyOrder2 = bodyA === body2.body && bodyB === body1.body
  return bodyOrder1 || bodyOrder2
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    box.buttons.up += 1
  }
  if (keyCode === LEFT_ARROW) {
    box.buttons.left += 1
  }
  if (keyCode === RIGHT_ARROW) {
    box.buttons.right += 1
  }

  // D
  if (keyCode === 68) {
    box.buttons.rotateRight += 1
  }

  // A
  if (keyCode === 65) {
    box.buttons.rotateLeft += 1
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
    box.buttons.up -= 1
  }
  if (keyCode === LEFT_ARROW) {
    box.buttons.left -= 1
  }
  if (keyCode === RIGHT_ARROW) {
    box.buttons.right -= 1
  }

  // D
  if (keyCode === 68) {
    box.buttons.rotateRight -= 1
  }

  // A
  if (keyCode === 65) {
    box.buttons.rotateLeft -= 1
  }
}
