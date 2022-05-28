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
  createCanvas(windowWidth, windowHeight)
  background(120)
  ellipseMode(RADIUS)

  setupSocket()

  fromPosition = createVector(width / 2, height / 2)
  maxRadius = width * 0.01
}

function draw() {
  background(fillColor)
  strokeWeight(4)
  noFill()
  circle(fromPosition.x, fromPosition.y, maxRadius)
}

function handleMouseLogic() {
  toPosition = createVector(mouseX, mouseY)

  const diffVector = p5.Vector.sub(toPosition, fromPosition)
  const angle = diffVector.heading()
  let magnitude = map(diffVector.mag(), 0, maxRadius, 0, 1)
  magnitude = Math.min(magnitude, 1)

  socket.emit('vectorInput', { magnitude, angle })
}

function mousePressed() {
  handleMouseLogic()
}

function mouseDragged() {
  handleMouseLogic()
}

function mouseReleased() {
  socket.emit('vectorInput', { magnitude: 0, angle: 0 })
}
