import { CONST, GRID_CONST } from "../const/const";

export class GridCell extends Phaser.GameObjects.Sprite {
  private is_occupied: boolean;
  private index_w = 0;
  private index_h = 0;

  constructor(scene, params) {
    super(scene, params.x, params.y, 'cell');

    this.index_w = params.index_w;
    this.index_h = params.index_h;

    this.setOrigin(0, 0);
    this.setScale(
      (GRID_CONST.CELL_WIDTH - GRID_CONST.CELL_BORDER_SIZE) / this.width,
      (GRID_CONST.CELL_HEIGHT - GRID_CONST.CELL_BORDER_SIZE) / this.height
    );
  }

  setIsOccupied(is_occupied: boolean) {
    this.is_occupied = is_occupied;
    if (is_occupied) {
      this.setAlpha(0.5);
    } else {
      this.setAlpha(1.0);
    }
  }

  getIsOccupied(): boolean {
    return this.is_occupied;
  }

  getIntexW(): number {
    return this.index_w;
  }

  getIntexH(): number {
    return this.index_h;
  }
}
