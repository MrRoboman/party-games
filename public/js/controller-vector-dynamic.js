let fillColor = 120

let socket

let fromPosition, toPosition
let maxRadius

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
  })
}

function setup() {
  setupSocket()
  createCanvas(windowWidth, windowHeight)
  ellipseMode(RADIUS)

  maxRadius = width * 0.3
}

function draw() {
  background(fillColor)

  if (fromPosition) {
    stroke(0)
    strokeWeight(4)
    noFill()
    circle(fromPosition.x, fromPosition.y, maxRadius)
  }
}

function mousePressed() {
  fromPosition = createVector(mouseX, mouseY)
  toPosition = createVector(mouseX, mouseY)
}

function mouseDragged() {
  toPosition.x = mouseX
  toPosition.y = mouseY

  const diffVector = p5.Vector.sub(toPosition, fromPosition)
  const angle = diffVector.heading()
  let magnitude = map(diffVector.mag(), 0, maxRadius, 0, 1)

  console.log(magnitude) // eslint-disable-line
  if (magnitude > 1) {
    const correctionVector = p5.Vector.fromAngle(angle + PI)
    correctionVector.mult(maxRadius)
    fromPosition = p5.Vector.add(toPosition, correctionVector)
    magnitude = 1
  }

  socket.emit('vectorInput', { magnitude, angle })
}

function mouseReleased() {
  fromPosition = toPosition = null

  socket.emit('vectorInput', { magnitude: 0, angle: 0 })
}
// const oldTouchesById = {}
// let buttons = [0, 0, 0]
// // let buttons = { up: 0, left: 0, right: 0 }

// function touchStarted() {
//   // console.log(Math.floor(mouseY / buttonHeight)) // eslint-disable-line
//   const newTouches = touches.filter(touch => !oldTouchesById[touch.id])
//   newTouches.forEach(touch => {
//     // socket.emit('touch', [touch.x, touch.y])
//     oldTouchesById[touch.id] = {
//       buttonIdx: getButtonIdx(touch.x, touch.y),
//     }
//   })
//   // const buttonIdx = Math.floor(mouseY / buttonHeight)
//   buttons = [0, 0, 0]
//   for (const touchId in oldTouchesById) {
//     const { buttonIdx } = oldTouchesById[touchId]
//     // socket.emit('touch', buttonIdx)
//     if (buttonIdx > -1) {
//       buttons[buttonIdx] = 1
//     }
//   }

//   console.log(buttons) // eslint-disable-line
//   socket.emit('buttons', buttons)

//   return false // To prevent unexpected behahavior; i forgot to comment the url where I read about this.
// }

// function touchEnded() {
//   const oldTouchIds = Object.keys(oldTouchesById)
//   const activeTouchIds = touches.map(touch => String(touch.id))
//   const releasedTouchIds = oldTouchIds.filter(
//     touchId => !activeTouchIds.includes(touchId),
//   )
//   releasedTouchIds.forEach(touchId => delete oldTouchesById[touchId])

//   buttons = [0, 0, 0]
//   for (const touchId in oldTouchesById) {
//     const { buttonIdx } = oldTouchesById[touchId]
//     if (buttonIdx > -1) {
//       buttons[buttonIdx] = 1
//     }
//   }
//   socket.emit('buttons', buttons)
// }

// function getButtonIdx(_x, _y) {
//   for (let i = 0; i < touchareas.length; i++) {
//     const { x, y, w, h, buttonIdx } = touchareas[i]
//     if (
//       _x >= x - w / 2 &&
//       _x <= x + w / 2 &&
//       _y >= y - h / 2 &&
//       _y <= y + h / 2
//     ) {
//       return buttonIdx
//     }
//   }
//   return -1
// }
