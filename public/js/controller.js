let debug = false
let touchareas = []
let fillColor = 120

function createTouchArea(x, y, w, h, buttonIdx) {
  touchareas.push({
    x,
    y,
    w,
    h,
    buttonIdx,
  })
}

let socket

let layerPadding = 100
let drawingScale = 4
let drawings

function setupSocket() {
  socket = io()

  socket.on('identify yourself', () => {
    const uuid = localStorage.getItem('uuid')
    socket.emit('controllerClient', uuid)
    // console.log({ players }) // eslint-disable-line
    // for (id in players) {
    //   const player = players[id]
    //   circle(player.x, player.y, 50)
    // }
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
  rectMode(CENTER)
  noSmooth()

  setupSocket()

  drawings = {
    scale: 1,
    button: {
      _width: 200 * drawingScale,
      _height: 150 * drawingScale,
      _stroke: 'black',
      _strokeWeight: 8 * drawingScale,
    },
    arrow: {
      _width: 100 * drawingScale,
      _height: 100 * drawingScale,
      _strokeWeight: 8 * drawingScale,
      _headLengthPercent: 0.2,
      _bodyWidthPercent: 0.6,
    },
  }

  drawControls()

  createTouchArea(width * 0.5, height * 0.2, 600, 400, 0)
  createTouchArea(width * 0.25, height * 0.5, 400, 400, 1)
  createTouchArea(width * 0.75, height * 0.5, 400, 400, 2)
  // createTouchArea(220, 80, 500, 560, 0)
  // createTouchArea(width * 0.25, height * 0.5, 475, 475, 1)
  // createTouchArea(width * 0.75, height * 0.5, 475, 475, 2)

  if (debug) {
    touchareas.forEach(({ x, y, w, h }) => {
      fill(0, 50)
      rect(x, y, w, h)
    })
  }
}

function drawControls(redraw = false) {
  background(fillColor)

  push()
  translate(width * 0.5, height * 0.2)
  // drawButton()
  rotate(-PI / 2)
  drawArrow(redraw)
  pop()

  push()
  translate(width * 0.25, height * 0.5)
  // drawButton()
  rotate(-PI)
  drawArrow(redraw)
  pop()

  push()
  translate(width * 0.75, height * 0.5)
  // drawButton()
  drawArrow(redraw)
  pop()
}

function draw() {
  //   background(120)
  //   push()
  //   translate(width * 0.25, height / 2)
  //   drawArrow()
  //   pop()
  // console.log(mouseX, mouseY) // eslint-disable-line
}

function makeCoordinateFunction(length) {
  return percent => length * percent + layerPadding
}

function drawButton(redraw = false) {
  const { _width, _height, _strokeWeight } = drawings.button

  if (!drawings.button.layer || redraw) {
    let buttonLayer = drawings.button.layer

    if (!buttonLayer) {
      buttonLayer = drawings.button.layer = createGraphics(
        _width + layerPadding * 2,
        _height + layerPadding * 2,
      )
    } else {
      buttonLayer.clear()
    }

    buttonLayer.rectMode(CENTER)
    buttonLayer.strokeWeight(_strokeWeight)
    buttonLayer.rect(
      buttonLayer.width / 2,
      buttonLayer.height / 2,
      _width,
      _height,
      60,
    )
  }

  push()
  translate(-_width / 2 - layerPadding, -_height / 2 - layerPadding)
  image(drawings.button.layer, 0, 0)
  pop()
}

function drawArrow(redraw = false) {
  const {
    _width,
    _height,
    _strokeWeight,
    _headLengthPercent,
    _bodyWidthPercent,
  } = drawings.arrow
  // let arrowWidth = 75
  // let arrowHeight = 50

  if (!drawings.arrow.layer || redraw) {
    let arrowLayer = drawings.arrow.layer

    if (!arrowLayer) {
      arrowLayer = drawings.arrow.layer = createGraphics(
        _width + layerPadding * 2,
        _height + layerPadding * 2,
      )
    } else {
      arrowLayer.clear()
    }

    const getX = makeCoordinateFunction(_width)
    const getY = makeCoordinateFunction(_height)

    arrowLayer.strokeWeight(_strokeWeight)

    arrowLayer.beginShape()
    arrowLayer.vertex(getX(1), getY(0.5))
    arrowLayer.vertex(getX(_headLengthPercent), getY(1))
    arrowLayer.vertex(
      getX(_headLengthPercent),
      getY(1 - (1 - _bodyWidthPercent) / 2),
    )
    arrowLayer.vertex(getX(0), getY(1 - (1 - _bodyWidthPercent) / 2))
    arrowLayer.vertex(getX(0), getY((1 - _bodyWidthPercent) / 2))
    arrowLayer.vertex(
      getX(_headLengthPercent),
      getY((1 - _bodyWidthPercent) / 2),
    )
    arrowLayer.vertex(getX(_headLengthPercent), getY(0))
    arrowLayer.endShape(CLOSE)
  }

  push()
  translate(-_width / 2 - layerPadding, -_height / 2 - layerPadding)
  image(drawings.arrow.layer, 0, 0)
  pop()
}

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

  // const buttonIdx = Math.floor(mouseY / buttonHeight)
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
  // for (let i = 0; i < touchareas.length; i++) {
  // const { x, y, w, h, buttonIdx } = touchareas[i]
  // if (_x >= x && _x <= x + w && _y >= y && _y <= y + h) {
  // return buttonIdx
  // }
  // }
  for (let i = 0; i < touchareas.length; i++) {
    const { x, y, w, h, buttonIdx } = touchareas[i]
    // socket.emit('touch', {
    //   x: width * 0.5,
    //   y: height * 0.2,
    //   w: 400,
    //   h: 400,
    //   touch: [_x, _y],
    //   wtf: [_x >= x - w / 2, _x <= x + w / 2, _y >= y - h / 2, _y <= y + h / 2],
    // })
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
