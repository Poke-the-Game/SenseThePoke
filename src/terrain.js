import Phaser from 'phaser'

class TerrainGenerator {
  constructor (game, scene) {
    console.log('TerrainGenerator -- init')
    this.game = game
    this.scene = scene

    // scene
    let w = this.game.config.width
    let h = this.game.config.height

    let vertices = `10 10  10 50  50 50`

    this.bottom = this.scene.add.polygon(
      50, 200, vertices, 0x0000ff, 0.2)
    this.scene.matter.add.gameObject(
      this.bottom, {
        shape: {
          type: 'fromVerts',
          verts: vertices,
          flagInternal: true
        }
      })
    this.bottom.setStatic(true)

    this.scene.matter.world.on(
      'collisionstart',
      function (event, bodyA, bodyB) {
        console.log(event, bodyA, bodyB)
      }
    )
  }

  nextLine () {
    this.y = Phaser.Math.Between(0, 500)
  }
}

export default TerrainGenerator
