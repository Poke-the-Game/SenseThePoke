import Phaser from 'phaser'
import TerrainGenerator from './terrain'

let config = {
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

let game = new Phaser.Game(config)

function preload () {
  this.load.image('player', 'assets/player.png')
  this.load.image('bullet', 'assets/bullet.png')
}

function create () {
  this.cursors = this.input.keyboard.createCursorKeys()
  this.matter.world.setBounds().disableGravity()

  this.player = this.matter.add.image(50, 300, 'player')

  this.terrain = new TerrainGenerator(game, this)
  this.terrain.nextLine()
}

function update () {
  this.player.setVelocity(0)

  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-8)
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(8)
  }
}
