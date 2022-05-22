// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/

const express = require('express')
const app = express()
const server = require('http').Server(app)
const { Server } = require('socket.io')
const io = new Server(server)

const gameClients = {}
const players = {}
const playerList = []
const velocity = { x: 0, y: 0 }

const buttons = [false, false, false]

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/controller/', function (req, res) {
  res.sendFile(__dirname + '/public/controller.html')
})

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.emit('who are you')

  // create a new player and add it to our players object
  // players[socket.id] = {
  //   rotation: 0,
  //   x: 100,
  //   y: 100,
  //   socketId: socket.id,
  // }
  // socket.emit('currentPlayers', players)
  // socket.broadcast.emit('newPlayer', players[socket.id])

  socket.on('gameClient', () => {
    console.log('Game Client Joined')
    gameClients[socket.id] = socket
    socket.emit('currentPlayers', players)
  })

  socket.on('controllerClient', () => {
    const player = {
      socketId: socket.id,
      buttons: [0, 0, 0],
    }

    players[socket.id] = player
    playerList.push(player)

    for (const id in gameClients) {
      gameClients[id].emit('currentPlayers', players)
    }
  })

  socket.on('disconnect', function () {
    console.log('user disconnected')

    delete players[socket.id]
    for (let i = 0; i < playerList.length; i++) {
      const player = playerList[i]
      if (socket.id === player.socketId) {
        playerList.splice(i, 1)
        break
      }
    }
    io.emit('playerDisconnect', socket.id)
  })

  socket.on('control', ({ x, y }) => {
    console.log(socket.id, { x, y }) // eslint-disable-line
    for (const id in gameClients) {
      const game = gameClients[id]
      game.emit('velocity', { x, y })
    }
  })

  socket.on('buttons', buttons => {
    // console.log('touches', touches) // eslint-disable-line
    // console.log('button:', buttonIdx, pressed)
    // buttons[buttonIdx] = pressed
    console.log(buttons) // eslint-disable-line
    players[socket.id].buttons = buttons
    const allButtons = playerList.map(p => p.buttons)
    for (const id in gameClients) {
      const game = gameClients[id]
      game.emit('buttons', allButtons)
    }
  })
})

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`)
})
