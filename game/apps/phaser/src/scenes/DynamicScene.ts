import Phaser from "phaser";
import SocketManager from "../managers/SocketManager";

type PhysicsCircle = Phaser.GameObjects.Arc & {
  body: Phaser.Physics.Arcade.Body;
};

type PhysicsSprite = Phaser.GameObjects.Sprite & {
  body: Phaser.Physics.Arcade.Body;
};

//this is what the scenes will be - objects and their functionality
export default class DynamicScene extends Phaser.Scene {
  private player!: PhysicsCircle | PhysicsSprite;
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private socketManager!: SocketManager;

  private playerSpeed: number = 200;
  private jumpVelocity: number = -300;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.socketManager = new SocketManager(this);

    //ground
    this.ground = this.physics.add.staticGroup();
    const ground = this.add.rectangle(400, 300, 800, 20, 0x555555);
    this.physics.add.existing(ground, true);
    this.ground.add(ground);

    //default player
    this.createDefaultPlayer();

    //listening for game-state-update
    this.events.on("game-state-update", (gameState: any) => {
      this.updateGameState(gameState);
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  //default circle as character
  private createDefaultPlayer() {
    const circle = this.add.circle(100, 250, 20, 0x3498db);
    this.physics.add.existing(circle);
    (circle as PhysicsCircle).body.setCollideWorldBounds(true);
    this.physics.add.collider(circle, this.ground);

    this.player = circle as PhysicsCircle;
  }

  private updateGameState(gameState: any) {
    console.log("updating game state:", gameState);

    //update player character
    if (gameState.character) {
      console.log("🎨 Replacing player...");
      this.replacePlayer(gameState.character);
    }

    //update obstacles
    if (gameState.obstacles) {
      console.log("🚧 Updating obstacles...");
      this.updateObstacles(gameState.obstacles);
    }

    //update game setting
    this.playerSpeed = gameState.speed;
    this.jumpVelocity = gameState.jumpVelocity;
    console.log(
      "✅ Game state updated! Speed:",
      this.playerSpeed,
      "Jump:",
      this.jumpVelocity
    );
  }

  private replacePlayer(newCharacter: Phaser.GameObjects.Sprite) {
    const oldX = this.player.x;
    const oldY = this.player.y;

    this.player.destroy();

    //position new player
    newCharacter.setPosition(oldX, oldY);
    this.physics.add.existing(newCharacter);

    const physicsSprite = newCharacter as PhysicsSprite;
    physicsSprite.body.setCollideWorldBounds(true);
    this.physics.add.collider(physicsSprite, this.ground);

    //to add collision with obstacles
    this.obstacles.forEach((obstacle) => {
      this.physics.add.collider(physicsSprite, obstacle);
    });

    this.player = physicsSprite;
  }

  private updateObstacles(newObstacles: Phaser.GameObjects.Rectangle[]) {
    // clearing old obstacles
    this.obstacles.forEach((obs) => obs.destroy());
    this.obstacles = [];

    //posotion and add new obstacles
    newObstacles.forEach((obstacle, index) => {
      obstacle.setPosition(300 + index * 100, 350); //position obstacles
      this.physics.add.existing(obstacle, true);
      this.physics.add.collider(this.player, obstacle);
      this.obstacles.push(obstacle);
    });
  }

  //this define what an object will do
  update() {
    if (!this.player || !this.player.body) return;

    //resetting x value to prevent player sliding in left or right after hitting key
    this.player.body.setVelocityX(0);

    //horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-this.playerSpeed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(this.playerSpeed);
    }

    //jump action
    if (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      this.player.body.blocked.down // jump only when player is down not mid-air
    ) {
      this.player.body.setVelocityY(this.jumpVelocity);
    }
  }
}
