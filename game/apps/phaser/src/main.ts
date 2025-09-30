import Phaser from "phaser";
import DynamicScene from "./scenes/DynamicScene";

//this is how the game skeleton will be
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#2d2d2d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [DynamicScene],
};

const game = new Phaser.Game(config);

export default game;
