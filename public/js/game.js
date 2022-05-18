let world, engine
let body
let ground

function setup() {
  createCanvas(800, 600)
  rectMode(CENTER)

  engine = Matter.Engine.create()
  world = engine.world

  body = new Box(100, 100, 100, 100)
  ground = new Box(width / 2, height - 25, width, 50, { isStatic: true })
}

function draw() {
  Matter.Engine.update(engine)

  background(120)

  body.show()
  ground.show()
}
