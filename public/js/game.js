let world, engine
let body
let ground

function setup() {
  createCanvas(800, 600)
  background(120)
  rectMode(CENTER)

  engine = Matter.Engine.create()
  world = engine.world

  body = Matter.Bodies.rectangle(100, 100, 100, 100)
  Matter.World.add(world, body)

  ground = Matter.Bodies.rectangle(width / 2, height - 25, width, 50)
  Matter.World.add(world, ground)
  ground.isStatic = true
}

function draw() {
  Matter.Engine.update(engine)

  background(120)

  let pos = body.position
  let angle = body.angle
  push()
  translate(pos.x, pos.y)
  rotate(angle)
  rect(0, 0, 100, 100)
  pop()

  pos = ground.position
  angle = ground.angle
  push()
  translate(pos.x, pos.y)
  rotate(angle)
  rect(0, 0, width, 50)
  pop()
}
