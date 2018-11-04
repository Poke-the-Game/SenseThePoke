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
      (event, bodyA, bodyB) => {
        // game over
        if (bodyA.label === 'player' && bodyB.label === 'obstacle') {
          this.scene.matter.world.remove(bodyB)
          bodyB.gameObject.setActive(false)
          bodyB.gameObject.setVisible(false)

          this.game.gameOver(this.game, this.scene)
        }
        if (bodyA.label === 'obstacle' && bodyB.label === 'player') {
          this.scene.matter.world.remove(bodyA)
          bodyA.gameObject.setActive(false)
          bodyA.gameObject.setVisible(false)

          this.game.gameOver(this.game, this.scene)
        }

        // something else
        if (bodyA.label === 'obstacle' && bodyB.label === 'Rectangle Body') {
          this.scene.matter.world.remove(bodyA)
          bodyA.gameObject.setActive(false)
          bodyA.gameObject.setVisible(false)
        }
        if (bodyA.label === 'Rectangle Body' && bodyB.label === 'obstacle') {
          this.scene.matter.world.remove(bodyB)
          bodyB.gameObject.setActive(false)
          bodyB.gameObject.setVisible(false)
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

      if (cur.gameObject.body.position.x < 20) {
        this.scene.matter.world.remove(cur.gameObject)
        cur.gameObject.setActive(false)
        cur.gameObject.setVisible(false)
      }
    }
  }

  spawnObstacle () {
    console.log('Add obstacle')

    let gw = this.game.config.width
    let gh = this.game.config.height

    let targetWidth = Phaser.Math.Between(20, 50)
    let targetHeight = Phaser.Math.Between(20, 50)

    let cur = this.scene.matter.add.image(
      gw - targetWidth, Phaser.Math.Between(gh / 5, gh * 4 / 5),
      (this.objects.length % 10 != 0) ? 'asteroid' : 'skylol')

    cur.setScale(targetWidth / cur.width, targetHeight / cur.height)

    cur.body.label = 'obstacle'

    this.objects.push({
      gameObject: cur,
      velocity: Phaser.Math.Between(-6, -1),
      angVelocity: Phaser.Math.FloatBetween(-0.1, 0.1)
    })
  }
}

export default TerrainGenerator
