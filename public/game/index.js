let socket

let mouseOrigin
let mouseCurrent

let players = {}
let velocity = {}

function setupSocket() {
  socket = io()

  socket.emit('gameClient')

  socket.on('currentPlayers', playersOnServer => {
    console.log({ players }) // eslint-disable-line
    players = playersOnServer
  })

  socket.on('velocity', ({ x, y }) => {
    velocity = { x, y }
  })
}

function setup() {
  ellipseMode(RADIUS)
  createCanvas(800, 600)
  background(120)

  setupSocket()
}

function draw() {
  background(50)
  for (id in players) {
    const player = players[id]
    const factor = 0.05
    player.x += velocity.x * factor
    player.y += velocity.y * factor
    player.x = Math.max(0, Math.min(width - 50, player.x))
    player.y = Math.max(0, Math.min(height - 50, player.y))
    rect(player.x, player.y, 50)
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
