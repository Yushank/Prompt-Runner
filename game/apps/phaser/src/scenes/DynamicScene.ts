import Phaser from "phaser";

type PhysicsCircle = Phaser.GameObjects.Arc & {
  body: Phaser.Physics.Arcade.Body;
};

//this is what the scenes will be - objects and their functionality
export default class DynamicScene extends Phaser.Scene {
  private player!: PhysicsCircle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private ground!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.player = this.add.circle(100, 200, 20, 0x3498db) as PhysicsCircle;
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.add.text(16, 16, "Use arrow keys to move", {
      fontSize: "18px",
      color: "#ffffff",
    });
  }

  //this define what an object will do
  update() {
    //resetting x value to prevent player sliding in left or right after hitting key
    this.player.body.setVelocityX(0);

    //horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
    }

    //jump action
    if (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      this.player.body.blocked.down // jump only when player is down not mid-air
    ) {
      this.player.body.setVelocityY(-400);
    }
  }
}
