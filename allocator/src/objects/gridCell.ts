import { CONST, GRID_CONST, COLOR_CONST } from "../const/const";
import { ShapeType } from "../logic/shapeType"

export enum CellStatus {
  FREE,
  ALLOCATED,
  FREEING,
  ALLOCATING,
}

export class GridCell extends Phaser.GameObjects.Sprite {
  private column;
  private row;
  private status: CellStatus;

  constructor(scene, params) {
    super(scene, params.x, params.y, 'negative_atom');

    this.column = params.column;
    this.row = params.row;

    this.setOrigin(0, 0);
    this.setScale(
      GRID_CONST.CELL_WIDTH / this.width,
      GRID_CONST.CELL_HEIGHT / this.height
    );

    this.status = CellStatus.FREE;
  }

  isSuitableFor(shapeType: ShapeType): boolean {
    if (shapeType == ShapeType.Creator) {
      return this.status == CellStatus.FREE;
    } else {
      return this.status == CellStatus.ALLOCATED;
    }
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
      this.setTexture('negative_atom');
    } else if (this.status == CellStatus.ALLOCATED) {
      this.setAlpha(1.0);
      this.setTexture('positive_atom');
    } else if (this.status == CellStatus.FREEING) {
      this.setAlpha(0.5);
      this.setTexture('negative_atom');
    } else if (this.status == CellStatus.ALLOCATING) {
      this.setAlpha(0.5);
      this.setTexture('positive_atom');
    }
  }
}
