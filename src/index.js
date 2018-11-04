import Phaser from 'phaser'

import config from './config'
import TerrainGenerator from './terrain'

let gameConfig = {
  type: Phaser.AUTO,
  parent: 'pokethegame',
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

let game = new Phaser.Game(gameConfig)
let positionX = 50
let positionY = 300
let velocityY = 0
let running = true

function preload () {
  this.load.image('player', 'assets/player.png')
  this.load.image('bullet', 'assets/bullet.png')
  this.load.image('skylol', 'assets/skylol.png')
  this.load.image('asteroid', 'assets/asteroid.png')
}

function create () {
  this.cursors = this.input.keyboard.createCursorKeys()
  this.matter.world.setBounds().disableGravity()

  this.player = this.matter.add.image(50, positionY, 'player')
  this.player.body.label = 'player'

  this.lastShotTime = -1
  this.bullets = []

  this.terrain = new TerrainGenerator(game, this)
  this.time.addEvent({
    delay: 500,
    callback: this.terrain.spawnObstacle,
    callbackScope: this.terrain,
    repeat: -1
  })

  this.score = 0
  this.scoreboard = this.add.text(
    this.game.config.width, 0, 'undef',
    {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffff00'
    }
  )
  this.scoreboard.setOrigin(1, 0)

  let ws = new window.WebSocket(config.ws_url)
  this.data_chain = []
  ws.addEventListener('message', ({ data }) => {
    data = parseFloat(data)
    if (data === 0) {
      return
    }

    // calibration
    let avg = -1
    let num = 10
    if (this.data_chain.length < num) {
      this.data_chain.push(data)
      console.log(`Waiting for more data ${this.data_chain.length}/${num}`)
    } else {
      let sum = this.data_chain.reduce(
        (previous, current) => current + previous, 0)
      avg = sum / this.data_chain.length
    }

    if (avg === -1) {
      return
    }
    if (this.cursors.up.isDown || this.cursors.down.isDown) {
      return
    }

    // compute sensor strength
    let diff = data - avg

    let minY = -8
    let maxY = 8
    velocityY = Math.min(Math.max(minY, diff), maxY)
    velocityY *= -1

    // console.log(avg, data, diff, velocityY)
  })
}

function update (time, delta) {
  // terrain
  this.terrain.update()

  // bullets
  for (let cur of this.bullets) {
    cur.gameObject.setVelocityX(cur.velocity)

    if (cur.gameObject.body.position.x > game.config.width - 20) {
      this.matter.world.remove(cur.gameObject)
      cur.gameObject.setActive(false)
      cur.gameObject.setVisible(false)
    }
  }

  // possible restart
  let key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
  if (Phaser.Input.Keyboard.JustDown(key)) {
    this.scene.restart()
    this.score = 0
    running = true
  }

  // don't do anything else if game is over
  if (!running) {
    return
  }

  // player handling
  this.player.setPosition(
    positionX, this.player.body.position.y)
  this.player.setAngle(0)

  // keyboard controls
  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-8)
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(8)
  } else {
    this.player.setVelocityY(velocityY)
  }

  if (this.cursors.space.isDown) {
    let diff = time - this.lastShotTime
    if (diff > 100) {
      this.lastShotTime = time
      let cur = this.matter.add.image(
        positionX + 20, this.player.body.position.y, 'bullet')
      cur.body.label = 'bullet'

      this.bullets.push({
        gameObject: cur,
        velocity: 5
      })
    }
  }

  // score
  this.score += 1 // TODO: this is bad...
  this.scoreboard.setText(`Score: ${this.score}`)
}

game.gameOver = (game, scene) => {
  console.log('BOOM')
  running = false

  // handle simulation
  scene.matter.world.remove(scene.player)
  scene.player.setActive(false)
  scene.player.setVisible(false)

  // show score
  scene.scoreboard.setText(`Final score: ${scene.score}`)
  scene.scoreboard.setStyle({
    fontSize: 64,
    color: '#ff0000'
  })

  scene.scoreboard.setOrigin(0.5, 0.5)
  scene.scoreboard.setPosition(game.config.width / 2, game.config.height / 2)
}
