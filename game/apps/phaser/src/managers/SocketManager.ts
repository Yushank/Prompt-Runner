import { io, Socket } from "socket.io-client";
import { GameFactory } from "../factories/GameFactory";
import Phaser from "phaser";

export default class SocketManager {
  private socket!: Socket;
  private gameFactory!: GameFactory;
  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.gameFactory = new GameFactory(scene);
    this.socket = io("http://localhost:4000");
    this.scene = scene;
    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on("gameData", (data) => {
      console.log("Received complete game data:", data);

      if (data.type === "gameUpdate") {
        this.processGameUpdate(data.data);
      }
    });
  }

  private processGameUpdate(gameData: any) {
    const characterData = gameData.character || this.getDefaultCharacter(); //new data or default data
    const obstacle = gameData.obstacles || [this.getDefaultObstacles()];
    const speed = gameData.speed?.value || 200;
    const jumpVelocity = gameData.jump?.velocityY || -300;

    //this part create game objects
    const character = this.gameFactory.createCharacter(characterData); //create character in gameFactory with data
    const obstacleSprites = obstacle.map((obs: any) =>
      this.gameFactory.createObstacle(obs)
    );

    //emit complete game state
    this.scene.events.emit("game-state-update", {
      character,
      obstacles: obstacleSprites,
      speed,
      jumpVelocity,
    });
  }

  private getDefaultCharacter() {
    return {
      name: "default_character",
      width: 32,
      height: 32,
      pixels: [
        { x: 10, y: 10, color: "#3498db" },
        { x: 11, y: 10, color: "#3498db" },
      ],
    };
  }

  private getDefaultObstacles() {
    return {
      type: "rock",
      width: 20,
      height: 20,
      color: "#808080",
    };
  }
}
