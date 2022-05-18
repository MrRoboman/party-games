let socket

let mouseOrigin
let mouseCurrent

function setupSocket() {
  socket = io()

  socket.emit('controllerClient')
  // socket.on('currentPlayers', players => {
  //   console.log({ players }) // eslint-disable-line
  //   for (id in players) {
  //     const player = players[id]
  //     circle(player.x, player.y, 50)
  //   }
  // })
}

let buttonHeight

function setup() {
  // ellipseMode(RADIUS)
  console.log({ windowWidth, windowHeight })
  createCanvas(windowWidth, windowHeight)
  background(120)

  buttonHeight = Math.floor(windowHeight / 3)
  strokeWeight(4)
  for (let i = 0; i < 3; i++) {
    rect(0, buttonHeight * i, windowWidth, buttonHeight)
  }

  setupSocket()
}

function draw() {
  // background(120)
}

const touchesById = {}
let buttons = [false, false, false]

function touchStarted() {
  // console.log(Math.floor(mouseY / buttonHeight)) // eslint-disable-line
  const newTouches = touches.filter(touch => !touchesById[touch.id])
  newTouches.forEach(touch => {
    touchesById[touch.id] = {
      buttonIdx: Math.floor(touch.y / buttonHeight),
    }
  })
  // const buttonIdx = Math.floor(mouseY / buttonHeight)
  buttons = [false, false, false]
  for (const touchId in touchesById) {
    const touch = touchesById[touchId]
    buttons[touch.buttonIdx] = true
  }

  socket.emit('button', buttons)

  return false // To prevent unexpected behahavior
}

function mouseReleased() {
  const savedTouchIds = Object.keys(touchesById)
  const activeTouchIds = touches.map(touch => String(touch.id))
  const releasedTouchIds = savedTouchIds.filter(
    touchId => !activeTouchIds.includes(touchId),
  )
  releasedTouchIds.forEach(touchId => delete touchesById[touchId])

  // const buttonIdx = Math.floor(mouseY / buttonHeight)
  buttons = [false, false, false]
  for (const touchId in touchesById) {
    const touch = touchesById[touchId]
    buttons[touch.buttonIdx] = true
  }
  socket.emit('button', buttons)
}

// function pressUp() {
//   console.log('up')
// }
