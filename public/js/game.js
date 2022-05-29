const numPlayers = 2
let config = {
  arena: {
    ceilingThickness: 50,
    floorThickness: 50,
    goalThickness: 50,
    goalWidth: 300,
    rampThickness: 200,
    wallThickness: 200,
  },
  players: [
    { fill: 'crimson', startPosition: { x: 0.25, y: 0.8 } },
    { fill: 'aqua', startPosition: { x: 0.75, y: 0.8 } },
  ],
  misc: {
    boxBallCollisionVelocityMultiplier: 1.2,
  },
  keyboardControls: {
    // Player 1 UP
    // W
    87: {
      player: 0,
      vectorInput: { x: 0, y: -1 },
    },
    // Player 1 LEFT
    // A
    65: {
      player: 0,
      vectorInput: { x: -1, y: 0 },
    },
    // Player 1 RIGHT
    // D
    68: {
      player: 0,
      vectorInput: { x: 1, y: 0 },
    },
    // Player 2 UP
    // up arrow
    38: {
      player: 1,
      vectorInput: { x: 0, y: -1 },
    },
    // Player 2 LEFT
    // left arrow
    37: {
      player: 1,
      vectorInput: { x: -1, y: 0 },
    },
    // Player 2 RIGHT
    // right arrow
    39: {
      player: 1,
      vectorInput: { x: 1, y: 0 },
    },
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
let players = []
// let box
let ball
let leftGoal
let rightGoal
let timer
let scores = []

function setupSocket() {
  socket = io()

  socket.on('identify yourself', () => {
    const uuid = localStorage.getItem('uuid')
    socket.emit('gameClient', uuid)
  })

  socket.on('uuid', uuid => {
    localStorage.setItem('uuid', uuid)
  })

  socket.on('players', serverPlayers => {
    console.log({ serverPlayers }) // eslint-disable-line
    serverPlayers.forEach(({ isActive, fill, startPosition }, idx) => {
      if (!players[idx]) {
        const { x, y } = startPosition
        const box = new Box(width * x, height * y, 150, 150)
        box.fill = fill
        players.push(box)
      }

      players[idx].active = isActive
    })
  })

  socket.on('buttons', allButtons => {
    console.log({ allButtons }) // eslint-disable-line
    allButtons.forEach((buttons, idx) => {
      players[idx].buttons = buttons
    })
  })

  socket.on('vectorInputs', vectorInputs => {
    console.log({ vectorInputs }) // eslint-disable-line
    vectorInputs.forEach((vectorInput, idx) => {
      players[idx].setVectorInput(vectorInput)
    })
  })
}

let bounceSound, jetSound

function preload() {
  bounceSound = loadSound('assets/bounce.wav')
  jetSound = loadSound('assets/explosion.wav')
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

  // engine.gravity.scale = 0.0007

  createArenaBodies()

  // Box
  // box = addBody(
  //   new Box(
  //     width / 4,
  //     height - config.arena.floorThickness - 100,
  //     100,
  //     100,
  //     {},
  //   ),
  // )

  ball = addBody(
    new Ball(width / 2, height / 2 - 200, 50, {
      inertia: Infinity,
      restitution: 0.8,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.00005,
    }),
  )

  timer = new Timer()

  scores.push(new Score('crimson', { x: 90, y: 50 }, 1))
  scores.push(new Score('aqua', { x: width - 90, y: 50 }, -1))

  changeState(new GameStateStart())
}

function draw() {
  gameState.input()
  gameState.update()
  gameState.draw()
}

function reset() {
  timer.start(12000000)
  // timer.start(2000)
  scores.forEach(score => (score.score = 0))
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
  players.forEach(body => body.show())
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
  // ;[
  //   [wallThickness, ceilingThickness],
  //   [wallThickness, height - floorThickness],
  //   [width - wallThickness, ceilingThickness],
  //   [width - wallThickness, height - floorThickness],
  // ].forEach(([x, y]) => {
  //   const ramp = new Wall(x, y, rampThickness, rampThickness, { angle: PI / 4 })
  //   // bodies.push(ramp)
  //   // arenaBodies.ramps.push(ramp)
  //   arenaBods.push(ramp)
  // })
  // arenaBods.ramps.push(ramp)
  arenaBods.push(new Ramp(width - 455, height - 305, 280, 10))
  arenaBods.push(new Ramp(455, height - 305, 280, 10, PI / 2))
  arenaBods.push(new Ramp(455, 305, 280, 10, PI))
  arenaBods.push(new Ramp(width - 455, 305, 280, 10, -PI / 2))

  // Build Goals
  ;[
    [goalThickness / 2, height / 2],
    [width - goalThickness / 2, height / 2],
  ].forEach(([x, y], idx) => {
    const goal = new Wall(x, y, goalThickness, goalWidth)
    // bodies.push(goal)
    // arenaBodies.goals.push(goal)
    goal.fill = config.players[idx].fill
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

  // Ramp temp
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
  if (config.keyboardControls[keyCode]) {
    const { player, vectorInput } = config.keyboardControls[keyCode]
    players[player].setVectorInput(vectorInput)
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
  if (config.keyboardControls[keyCode]) {
    const { player, action } = config.keyboardControls[keyCode]
    players[player].setVectorInput(vectorInput)
  }
}

function mousePressed() {
  bounceSound.play()
}
