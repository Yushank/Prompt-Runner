import Phaser from "phaser";

export class GameFactory {
  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createCharacter(characterData: any): Phaser.GameObjects.Sprite {
    const { width, height, pixels, grid, palette } = characterData;

    console.log("creating character:", characterData.name);
    console.log("size:", width, "x", height);

    let finalPixels = pixels;

    //converting grid to pixels if grid format
    if (grid && palette) {
      console.log("converting grid to pixels...");
      finalPixels = this.gridToPixels(grid, palette);
    }

    console.log("Total pixels:", finalPixels?.length);

    if (!finalPixels || finalPixels.length === 0) {
      console.warn("No pixels to render!");
      return this.createFallbackCharacter();
    }

    const renderTexture = this.scene.add.renderTexture(0, 0, width, height);

    finalPixels.forEach((pixel: any) => {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(this.hexToNumber(pixel.color));
      graphics.fillRect(pixel.x, pixel.y, 1, 1);
      renderTexture.draw(graphics, 0, 0);
      graphics.destroy();
    });

    const textureKey = `character_${Date.now()}`;
    renderTexture.saveTexture(textureKey);

    console.log("Character created:", textureKey);

    const sprite = this.scene.add.sprite(0, 0, textureKey);
    sprite.setScale(2);
    renderTexture.destroy();

    return sprite;
  }

  private gridToPixels(grid: string[], palette: any) {
    const pixels: Array<{ x: number; y: number; color: string }> = [];

    grid.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        const color = palette[char];

        //skip if transparent
        if (char !== "." && color !== "#00000000") {
          pixels.push({ x, y, color });
        }
      }
    });

    return pixels;
  }

  private createFallbackCharacter(): Phaser.GameObjects.Sprite {
    console.log("creating a fallback character");

    const size = 14;
    const renderTexture = this.scene.add.renderTexture(0, 0, size, size);

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x3498db);
    graphics.fillRect(4, 4, 8, 8);

    renderTexture.draw(graphics, 0, 0);
    graphics.destroy();

    const textureKey = `fallback_${Date.now()}`;
    renderTexture.saveTexture(textureKey);

    const sprite = this.scene.add.sprite(0, 0, textureKey);
    sprite.setScale(2);
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
