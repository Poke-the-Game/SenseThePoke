import Phaser from 'phaser'

let config = {
  type: Phaser.AUTO,
  parent: 'pokethegame',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

let cursors, player
let game = new Phaser.Game(config)

function preload () {
  this.load.image('logo', 'assets/logo.png')
}

function create () {
  // setup controls
  cursors = this.input.keyboard.createCursorKeys()

  // add elements to scene
  player = this.physics.add.image(400, 300, 'logo')
  player.setCollideWorldBounds(true)
}

function update () {
  player.setVelocity(0)

  if (cursors.up.isDown) {
    player.setVelocityY(-300)
  } else if (cursors.down.isDown) {
    player.setVelocityY(300)
  }
}
