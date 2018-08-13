import { CONST, GRID_CONST, COLOR_CONST } from "../const/const";
import { ShapeType } from "../logic/shapeType"
import { randomInt } from "../logic/math";

export enum CellStatus {
  FREE,
  ALLOCATED,
  FREEING,
  ALLOCATING,
}

enum HoverStatus {
  NONE,
  CORRECT,
  INCORRECT,
}

export class GridCell extends Phaser.GameObjects.Sprite {
  private column;
  private row;
  private status: CellStatus;
  private hoverStatus: HoverStatus;

  constructor(scene, params) {
    super(scene, params.x, params.y, "negative_atom");

    this.column = params.column;
    this.row = params.row;

    this.setOrigin(0, 0);
    this.setScale(
      GRID_CONST.CELL_WIDTH / this.width,
      GRID_CONST.CELL_HEIGHT / this.height
    );

    if (randomInt(2) == 0) {
      this.status = CellStatus.FREE;
    } else {
      this.status = CellStatus.ALLOCATED;
    }

    this.hoverStatus = HoverStatus.NONE;

    this.updateGraphics();
  }

  isSuitableFor(shapeType: ShapeType): boolean {
    if (shapeType == ShapeType.Creator) {
      return this.status == CellStatus.FREE;
    } else {
      return this.status == CellStatus.ALLOCATED;
    }
    this.updateGraphics();
  }

  getColumn(): number {
    return this.column;
  }

  getRow(): number {
    return this.row;
  }

  setHovered(withCorrectPlacement: boolean = true) {
    if (withCorrectPlacement) {
      this.hoverStatus = HoverStatus.CORRECT;
    } else {
      this.hoverStatus = HoverStatus.INCORRECT;
    }
    this.updateGraphics();
  }

  clearHover() {
    this.hoverStatus = HoverStatus.NONE;
    this.updateGraphics();
  }

  setStatus(status: CellStatus) {
    this.status = status;
    this.updateGraphics();
  }

  private updateGraphics() {
    let suffix = "";
    if (this.hoverStatus != HoverStatus.NONE) {
      suffix = "_border";
      if (this.hoverStatus == HoverStatus.CORRECT) {
        this.setTint(0xFFFF00);
      } else {
        this.setTint(0x0000FF);
      }
    } else {
      this.clearTint();
    }
    if (this.status == CellStatus.FREE) {
      this.setAlpha(1.0);
      this.setTexture("negative_atom" + suffix);
    } else if (this.status == CellStatus.ALLOCATED) {
      this.setAlpha(1.0);
      this.setTexture("positive_atom" + suffix);
    } else if (this.status == CellStatus.FREEING) {
      this.setAlpha(0.5);
      this.setTexture("negative_atom" + suffix);
    } else if (this.status == CellStatus.ALLOCATING) {
      this.setAlpha(0.5);
      this.setTexture("positive_atom" + suffix);
    }
  }
}
