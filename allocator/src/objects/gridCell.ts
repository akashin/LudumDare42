import { CONST, GRID_CONST, COLOR_CONST } from "../const/const";

export enum CellStatus {
  FREE,
  ALLOCATED,
  FREEING,
  ALLOCATING,
}

export class GridCell extends Phaser.GameObjects.Sprite {
  private _isOccupied: boolean;
  private column;
  private row;
  private status: CellStatus;

  constructor(scene, params) {
    super(scene, params.x, params.y, 'cell');

    this.column = params.column;
    this.row = params.row;

    this.setOrigin(0, 0);
    this.setScale(
      (GRID_CONST.CELL_WIDTH - GRID_CONST.CELL_BORDER_SIZE) / this.width,
      (GRID_CONST.CELL_HEIGHT - GRID_CONST.CELL_BORDER_SIZE) / this.height
    );

    this.status = CellStatus.FREE;
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

  setHovered(withCorrectPlacement: boolean = true) {
    if (withCorrectPlacement) {
      this.setTint(COLOR_CONST.UNOCCUPIED_HOVER);
    } else {
      this.setTint(COLOR_CONST.OCCUPIED_HOVER);
    }
  }

  clearHover() {
    this.clearTint();
  }

  setStatus(status: CellStatus) {
    this.status = status;

    if (this.status == CellStatus.FREE) {
      this.setAlpha(1.0);
    } else if (this.status == CellStatus.ALLOCATED) {
      this.setAlpha(0.5);
    } else if (this.status == CellStatus.FREEING) {
      this.setAlpha(0.7);
    } else if (this.status == CellStatus.ALLOCATING) {
      this.setAlpha(0.8);
    }
  }
}
