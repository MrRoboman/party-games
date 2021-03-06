// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/

const config = require('./public/js/server-config.json')

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
    console.log('Controller Joined')
    if (!uuid) {
      uuid = generateUUID()
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
        vectorInput: { magnitude: 0, angle: 0 },
        buttons: [0, 0, 0],
        isActive: true,
        socket,
        uuid,
      })
    }

    // Tell the player controller what color they are
    for (let i = 0; i < players.length; i++) {
      if (players[i].uuid === uuid) {
        players[i].socket.emit('fill', config.players[i].fill)
      }
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

  socket.on('touch', touch => {
    console.log({ touch }) // eslint-disable-line
  })

  socket.on('buttons', buttons => {
    console.log(buttons) // eslint-disable-line
    players.forEach(player => {
      if (player.socket.id === socket.id) {
        player.buttons = buttons
      }
    })

    const allButtons = players.map(p => p.buttons)

    for (const id in gameClients) {
      const game = gameClients[id]
      game.socket.emit('buttons', allButtons)
    }
  })

  socket.on('vectorInput', vectorInput => {
    console.log(vectorInput) // eslint-disable-line
    players.forEach(player => {
      if (player.socket.id === socket.id) {
        player.vectorInput = vectorInput
      }
    })

    const allVectorInputs = players.map(p => p.vectorInput)

    for (const id in gameClients) {
      const game = gameClients[id]
      game.socket.emit('vectorInputs', allVectorInputs)
    }
  })
})

function getPlayersForGameClient() {
  return players.map(({ isActive }, idx) => ({
    isActive,
    fill: config.players[idx].fill,
    startPosition: config.players[idx].startPosition,
  }))
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
