import Phaser from "phaser";

type PhysicsCircle = Phaser.GameObjects.Arc & {
  body: Phaser.Physics.Arcade.Body;
};

//this is what the scenes will be - objects and their functionality
export default class DynamicScene extends Phaser.Scene {
  private player!: PhysicsCircle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "GameScene" });
  }

  //this create objects (characters, texts), that will appear on game
  create() {
    this.player = this.add.circle(400, 300, 20, 0x3498db) as PhysicsCircle;
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.add.text(16, 16, "Use arrow keys to move", {
      fontSize: "18px",
      color: "#ffffff",
    });

    this.add.rectangle(400, 580, 800, 4, 0x555555);
  }

  //this define what an object will do
  update() {
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocity(-200);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocity(200);
    }
  }
}
