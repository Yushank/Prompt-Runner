import Phaser from "phaser";

export class GameFactory {
  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createCharacter(characterData: any): Phaser.GameObjects.Sprite {
    const { width, height, pixels } = characterData;

    const renderTexture = this.scene.add.renderTexture(0, 0, width, height);

    pixels.forEach((pixel: any) => {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(this.hexToNumber(pixel.color));
      graphics.fillRect(pixel.x, pixel.y, 1, 1);
      renderTexture.draw(graphics, 0, 0);
      graphics.destroy();
    });

    const textureKey = `character_${Date.now()}`;
    renderTexture.saveTexture(textureKey);
    const sprite = this.scene.add.sprite(0, 0, textureKey);
    renderTexture.destroy();

    return sprite;
  }

  private hexToNumber(hex: string): number {
    return parseInt(hex.replace("#", "0x"));
  }

  createObstacle(obstacleData: any): Phaser.GameObjects.Rectangle {
    const { type, width, height, color } = obstacleData;

    const colorNum = parseInt(color.replace("#", "0x"));

    const obstacle = this.scene.add.rectangle(0, 0, width, height, colorNum);
    this.scene.physics.add.existing(obstacle, true);

    return obstacle;
  }
}
