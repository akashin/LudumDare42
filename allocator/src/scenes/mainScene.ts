export class MainScene extends Phaser.Scene {
  private grid: Array<Array<Phaser.GameObjects.Graphics>>;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.grid = Array<Array<Phaser.GameObjects.Graphics>>();
  }

  preload(): void {
  }

  create(): void {
    let GRID_HEIGHT = 5;
    let GRID_WIDTH = 5;

    for (var i = 0; i < GRID_HEIGHT; ++i) {
      this.grid.push(Array<Phaser.GameObjects.Graphics>());
      for (var j = 0; j < GRID_WIDTH; ++j) {
        let cell = this.add.graphics();
        cell.fillStyle(0xFFFFFF, 1.0)
        cell.fillRect(100 + i * 31, 100 + j * 31, 30, 30);

        this.grid[i].push(cell);
      }
    }

  }

  update(time): void {
  }
}
