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

let game = new Phaser.Game(config)

function preload () {
  this.load.image('player', 'assets/player.png')
  this.load.image('bullet', 'assets/bullet.png')

  this.load.scenePlugin('WeaponPlugin', 'node_modules/phaser3-weapon-plugin/dist/WeaponPlugin.min.js', null, 'weapons') // TODO: fix plugin path
}

function create () {
  // setup controls
  this.cursors = this.input.keyboard.createCursorKeys()

  // add elements to scene
  this.weapon = this.weapons.add(30, 'bullet')
  this.weapon.debugPhysics = true

  this.player = this.physics.add.image(0, 300, 'player')
  this.player.setCollideWorldBounds(true)

  // setup physics
  this.physics.add.existing(this.player)
  this.weapon.trackSprite(this.player, 0, 0, true)
}

function update () {
  this.player.setVelocity(0)

  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-300)
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(300)
  }

  if (this.cursors.space.isDown) {
    this.weapon.fire()
  }
}
