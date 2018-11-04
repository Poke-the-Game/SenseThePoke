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

function preload () {
  this.load.image('player', 'assets/player.png')
  this.load.image('bullet', 'assets/bullet.png')
}

function create () {
  this.cursors = this.input.keyboard.createCursorKeys()
  this.matter.world.setBounds().disableGravity()

  this.player = this.matter.add.image(50, positionX, 'player')

  this.terrain = new TerrainGenerator(game, this)
  this.terrain.nextLine()

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

    console.log(avg, data, diff, velocityY)
  })
}

function update () {
  this.player.setPosition(
    positionX, this.player.body.position.y)
  this.player.setAngle(0)

  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-8)
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(8)
  } else {
    this.player.setVelocityY(velocityY)
  }
}
