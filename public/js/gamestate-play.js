class GameStatePlay extends GameState {
  start() {
    Matter.Events.on(engine, 'collisionStart', this.checkForGoal)
  }

  input() {
    box && box.input()
  }

  update() {
    Matter.Engine.update(engine) // use deltaTime?
  }

  end() {
    Matter.Events.off(engine, 'collisionStart', this.checkForGoal)
  }

  checkForGoal(event) {
    event.pairs.forEach(pair => {
      if (isCollisionBetweenBodies(pair, ball, leftGoal)) {
        console.log('Left Goal!') // eslint-disable-line
        changeState(new GameStateGoal())
      }

      if (isCollisionBetweenBodies(pair, ball, rightGoal)) {
        console.log('Right Goal!') // eslint-disable-line
        changeState(new GameStateGoal())
      }
    })
  }
}
