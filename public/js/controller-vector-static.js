let fillColor = 120

let socket

function setupSocket() {
  socket = io()

  socket.on('identify yourself', () => {
    const uuid = localStorage.getItem('uuid')
    socket.emit('controllerClient', uuid)
  })

  socket.on('uuid', uuid => {
    localStorage.setItem('uuid', uuid)
  })

  socket.on('fill', _fill => {
    fillColor = _fill
    drawControls()
  })
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(120)

  setupSocket()
}

function draw() {}

const oldTouchesById = {}
let buttons = [0, 0, 0]
// let buttons = { up: 0, left: 0, right: 0 }

function touchStarted() {
  // console.log(Math.floor(mouseY / buttonHeight)) // eslint-disable-line
  const newTouches = touches.filter(touch => !oldTouchesById[touch.id])
  newTouches.forEach(touch => {
    // socket.emit('touch', [touch.x, touch.y])
    oldTouchesById[touch.id] = {
      buttonIdx: getButtonIdx(touch.x, touch.y),
    }
  })
  // const buttonIdx = Math.floor(mouseY / buttonHeight)
  buttons = [0, 0, 0]
  for (const touchId in oldTouchesById) {
    const { buttonIdx } = oldTouchesById[touchId]
    // socket.emit('touch', buttonIdx)
    if (buttonIdx > -1) {
      buttons[buttonIdx] = 1
    }
  }

  console.log(buttons) // eslint-disable-line
  socket.emit('buttons', buttons)

  return false // To prevent unexpected behahavior; i forgot to comment the url where I read about this.
}

function touchEnded() {
  const oldTouchIds = Object.keys(oldTouchesById)
  const activeTouchIds = touches.map(touch => String(touch.id))
  const releasedTouchIds = oldTouchIds.filter(
    touchId => !activeTouchIds.includes(touchId),
  )
  releasedTouchIds.forEach(touchId => delete oldTouchesById[touchId])

  buttons = [0, 0, 0]
  for (const touchId in oldTouchesById) {
    const { buttonIdx } = oldTouchesById[touchId]
    if (buttonIdx > -1) {
      buttons[buttonIdx] = 1
    }
  }
  socket.emit('buttons', buttons)
}

function getButtonIdx(_x, _y) {
  for (let i = 0; i < touchareas.length; i++) {
    const { x, y, w, h, buttonIdx } = touchareas[i]
    if (
      _x >= x - w / 2 &&
      _x <= x + w / 2 &&
      _y >= y - h / 2 &&
      _y <= y + h / 2
    ) {
      return buttonIdx
    }
  }
  return -1
}
