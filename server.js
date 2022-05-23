// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/

const express = require('express')
const app = express()
const server = require('http').Server(app)
const { Server } = require('socket.io')
const io = new Server(server)
const { v4: generateUUID } = require('uuid')

const gameClients = {}
const players = []
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
  console.log('New Connection')
  socket.emit('identify yourself')

  socket.on('gameClient', uuid => {
    console.log('Game Client Joined')

    if (!uuid) {
      uuid = generateUUID()
      socket.emit('uuid', uuid)
    }

    gameClients[uuid] = {
      isActive: true,
      socket,
      uuid,
    }

    updateGameClientsOnPlayers()
    // Update about current players
    // socket.emit('currentPlayers', players)
  })

  socket.on('controllerClient', uuid => {
    console.log('on controllerClient')
    console.log(uuid) // eslint-disable-line
    if (!uuid) {
      uuid = generateUUID()
      console.log({ emit: uuid }) // eslint-disable-line
      socket.emit('uuid', uuid)
    }

    let isNewPlayer = true

    players.forEach(player => {
      if (player.uuid === uuid) {
        player.isActive = true
        player.socket = socket

        isNewPlayer = false
      }
    })

    if (isNewPlayer) {
      players.push({
        buttons: [0, 0, 0],
        isActive: true,
        socket,
        uuid,
      })
    }

    updateGameClientsOnPlayers()
  })

  socket.on('disconnect', function () {
    console.log('Disconnection')

    console.log({ theSocket: socket.id }) // eslint-disable-line
    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      console.log({ plaSocket: player.socket.id }) // eslint-disable-line
      if (player.socket.id === socket.id) {
        player.isActive = false
        break
      }
    }

    Object.keys(gameClients).forEach(id => {
      const game = gameClients[id]
      if (game.socket.id === socket.id) {
        game.isActive = false
      }
    })

    updateGameClientsOnPlayers()
  })

  socket.on('buttons', buttons => {
    console.log(buttons) // eslint-disable-line
  })
})

function getPlayersForGameClient() {
  return players.map(({ isActive }) => isActive)
}

function updateGameClientsOnPlayers() {
  console.log(getPlayersForGameClient()) // eslint-disable-line
  for (const id in gameClients) {
    gameClients[id].socket.emit('players', getPlayersForGameClient())
  }
}

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`)
})
