import { CONST, GRID_CONST } from "../const/const";

export class GridCell extends Phaser.GameObjects.Sprite {
  private _isOccupied: boolean;
  private column;
  private row;

  constructor(scene, params) {
    super(scene, params.x, params.y, 'cell');

    this.column = params.column;
    this.row = params.row;

    this.setOrigin(0, 0);
    this.setScale(
      (GRID_CONST.CELL_WIDTH - GRID_CONST.CELL_BORDER_SIZE) / this.width,
      (GRID_CONST.CELL_HEIGHT - GRID_CONST.CELL_BORDER_SIZE) / this.height
    );
  }

  set isOccupied(isOccupied: boolean) {
    this._isOccupied = isOccupied;

    if (this._isOccupied) {
      this.setAlpha(0.5);
    } else {
      this.setAlpha(1.0);
    }
  }

  get isOccupied(): boolean {
    return this._isOccupied;
  }

  getColumn(): number {
    return this.column;
  }

  getRow(): number {
    return this.row;
  }
}
