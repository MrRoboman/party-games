// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/

const express = require('express')
const app = express()
const server = require('http').Server(app)
const { Server } = require('socket.io')
const io = new Server(server)

const gameClients = {}
const players = {}
const velocity = { x: 0, y: 0 }

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/controller/', function (req, res) {
  res.sendFile(__dirname + '/public/controller/index.html')
})

io.on('connection', function (socket) {
  console.log('a user connected')

  // create a new player and add it to our players object
  // players[socket.id] = {
  //   rotation: 0,
  //   x: 100,
  //   y: 100,
  //   playerId: socket.id,
  // }
  // socket.emit('currentPlayers', players)
  // socket.broadcast.emit('newPlayer', players[socket.id])

  socket.on('gameClient', () => {
    gameClients[socket.id] = socket
    socket.emit('currentPlayers', players)
  })

  socket.on('controllerClient', () => {
    players[socket.id] = {
      x: 100,
      y: 100,
      playerId: socket.id,
    }

    for (const id in gameClients) {
      gameClients[id].emit('currentPlayers', players)
    }
  })

  socket.on('disconnect', function () {
    console.log('user disconnected')

    delete players[socket.id]
    io.emit('playerDisconnect', socket.id)
  })

  socket.on('control', ({ x, y }) => {
    console.log(socket.id, { x, y }) // eslint-disable-line
    for (const id in gameClients) {
      const game = gameClients[id]
      game.emit('velocity', { x, y })
    }
  })
})

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`)
})
