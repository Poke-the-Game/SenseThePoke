import Phaser from 'phaser'

class TerrainGenerator {
  constructor (game, scene) {
    console.log('TerrainGenerator -- init')
    this.game = game
    this.scene = scene

    this.objects = []

    // scene
    // let w = this.game.config.width
    // let h = this.game.config.height

    // let vertices = `10 10  10 50  50 50`

    // this.bottom = this.scene.add.polygon(
    //   50, 200, vertices, 0x0000ff, 0.2)
    // this.scene.matter.add.gameObject(
    //   this.bottom, {
    //     shape: {
    //       type: 'fromVerts',
    //       verts: vertices,
    //       flagInternal: true
    //     }
    //   })
    // this.bottom.setStatic(true)

    // collision handling
    this.scene.matter.world.on(
      'collisionstart',
      function (event, bodyA, bodyB) {
        // game over
        if (bodyA.label === 'player' && bodyB.label === 'obstacle') {
          console.log('BOOM')
          this.scene.matter.world.remove(bodyB)
        }
        if (bodyA.label === 'obstacle' && bodyB.label === 'player') {
          console.log('BOOM')
          this.scene.matter.world.remove(bodyA)
        }

        // something else
        if (bodyA.label === 'obstacle' && bodyB.label === 'Rectangle Body') {
          this.scene.matter.world.remove(bodyA)
        }
        if (bodyA.label === 'Rectangle Body' && bodyB.label === 'obstacle') {
          this.scene.matter.world.remove(bodyB)
        }
      }
    )
  }

  nextLine () {
    this.y = Phaser.Math.Between(0, 500)
  }

  update () {
    for (let cur of this.objects) {
      cur.gameObject.setVelocityX(cur.velocity)
      cur.gameObject.setAngularVelocity(cur.angVelocity)
    }
  }

  spawnObstacle () {
    console.log('Add obstacle')

    let gw = this.game.config.width
    let gh = this.game.config.height

    let w = Phaser.Math.Between(20, 50)
    let h = Phaser.Math.Between(20, 50)

    let cur = this.scene.add.rectangle(
      gw - 100, gh + Phaser.Math.Between(-gh / 2, gh / 2),
      w, h)
    this.scene.matter.add.gameObject(cur)

    cur.body.label = 'obstacle'

    this.objects.push({
      gameObject: cur,
      velocity: Phaser.Math.Between(-6, -1),
      angVelocity: Phaser.Math.FloatBetween(-0.1, 0.1)
    })
  }
}

export default TerrainGenerator
