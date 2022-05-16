let socket

let mouseOrigin
let mouseCurrent

function setupSocket() {
  socket = io()

  socket.emit('controllerClient')

  socket.on('currentPlayers', players => {
    console.log({ players }) // eslint-disable-line
    for (id in players) {
      const player = players[id]
      circle(player.x, player.y, 50)
    }
  })
}

function setup() {
  ellipseMode(RADIUS)
  createCanvas(window.innerWidth, window.innerHeight)
  background(120)

  setupSocket()
}

function draw() {
  background('pink')

  if (mouseOrigin) {
    if (mouseCurrent.x !== mouseX || mouseCurrent.y !== mouseY) {
      mouseCurrent.x = mouseX
      mouseCurrent.y = mouseY
      const { x, y } = p5.Vector.sub(mouseCurrent, mouseOrigin)
      socket.emit('control', { x, y })
    }
    const rad = p5.Vector.sub(mouseCurrent, mouseOrigin).mag() + 50
    noFill()
    circle(mouseOrigin.x, mouseOrigin.y, rad)

    fill(255)
    circle(mouseCurrent.x, mouseCurrent.y, 50)
  }
}

function mousePressed() {
  mouseOrigin = createVector(mouseX, mouseY)
  mouseCurrent = createVector(mouseX, mouseY)
}

function mouseReleased() {
  mouseOrigin = null
  mouseCurrent = null
  socket.emit('control', { x: 0, y: 0 })
}
