import { CONST, GRID_CONST } from "../const/const";

export class GridCell extends Phaser.GameObjects.Sprite {
  constructor(scene, params) {
    super(scene, params.x, params.y, 'cell');

    let wScale = (GRID_CONST.CELL_WIDTH - GRID_CONST.CELL_BORDER_SIZE) / this.width;
    let hScale = (GRID_CONST.CELL_HEIGHT - GRID_CONST.CELL_BORDER_SIZE) / this.height;

    if ("width" in params) {
      wScale = (params.width - GRID_CONST.CELL_BORDER_SIZE) / 300.0;
    }
    if ("height" in params) {
      hScale = (params.height - GRID_CONST.CELL_BORDER_SIZE) / 300.0;
    }

    this.setOrigin(0, 0);
    this.setScale(wScale, hScale);
    this.setInteractive();
  }

  setOccupied() {
    this.setAlpha(0.5);
  }
}
