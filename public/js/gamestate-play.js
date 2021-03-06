class GameStatePlay extends GameState {
  start() {
    Matter.Events.on(engine, 'collisionStart', this.checkForGoal)
    Matter.Events.on(engine, 'collisionStart', this.playCollisionSound)

    this.startTime = Date.now()
  }

  input() {
    players.forEach(player => player.input())
  }

  update() {
    Matter.Engine.update(engine) // use deltaTime?
    timer.update(deltaTime)
    if (timer.complete) {
      changeState(new GameStateGameOver())
    }
  }

  end() {
    Matter.Events.off(engine, 'collisionStart', this.checkForGoal)
    Matter.Events.off(engine, 'collisionStart', this.playCollisionSound)
  }

  playCollisionSound(event) {
    event.pairs.forEach(pair => {
      if (pair.bodyA === ball.body || pair.bodyB === ball.body) {
        console.log('bounce') // eslint-disable-line
        bounceSound.play()
      }
    })
  }

  bounceItHard(event) {
    event.pairs.forEach(pair => {
      for (let i = 0; i < players.length; i++) {
        const player = players[i]
        if (isCollisionBetweenBodies(pair, ball, player)) {
          const velocity = Matter.Vector.mult(
            ball.body.velocity,
            config.misc.boxBallCollisionVelocityMultiplier,
          )
          Matter.Body.setVelocity(ball.body, velocity)
        }
      }
    })
  }

  checkForGoal(event) {
    event.pairs.forEach(pair => {
      if (isCollisionBetweenBodies(pair, ball, leftGoal)) {
        console.log('Left Goal!') // eslint-disable-line
        scores[1].score++
        changeState(new GameStateGoal())
      }

      if (isCollisionBetweenBodies(pair, ball, rightGoal)) {
        console.log('Right Goal!') // eslint-disable-line
        scores[0].score++
        changeState(new GameStateGoal())
      }
    })
  }
}
