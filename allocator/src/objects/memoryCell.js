import { CONST, GRID_CONST, CONVEYOR_CONST } from "../const/const";
import { ShapeType } from "../logic/shapeType";

export class MemoryCell extends Phaser.GameObjects.Sprite {
  constructor(scene, params) {
    // TODO: Use other texture for this type of cell.
    super(scene, params.x, params.y, 'cell');

    this.setOrigin(0, 0);
    this.setScale(
      (CONVEYOR_CONST.SHAPE_CELL_WIDTH - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.width,
      (CONVEYOR_CONST.SHAPE_CELL_HEIGHT - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.height
    );
    // Color to distinguish from grid cells.
    if (params.shapeType == ShapeType.Creator) {
      this.setTint(CONVEYOR_CONST.CREATOR_SHAPE_COLOR);
    } else if (params.shapeType == ShapeType.Eraser) {
      this.setTint(CONVEYOR_CONST.ERASER_SHAPE_COLOR);
    } else {
      alert("Wrong shape type!");
    }
  }
}
