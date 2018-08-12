import { CONST, GRID_CONST, CONVEYOR_CONST } from "../const/const";
import { ShapeType } from "../logic/shapeType";

export class MemoryCell extends Phaser.GameObjects.Sprite {
  constructor(scene, params) {
    super(scene, params.x, params.y, '');

    // Color to distinguish from grid cells.
    if (params.shapeType == ShapeType.Creator) {
      this.setTint(CONVEYOR_CONST.CREATOR_SHAPE_COLOR);
      this.setTexture('positive_atom');
    } else if (params.shapeType == ShapeType.Eraser) {
      this.setTint(CONVEYOR_CONST.ERASER_SHAPE_COLOR);
      this.setTexture('negative_atom');
    } else {
      alert("Wrong shape type!");
    }

    this.setOrigin(0, 0);
    this.setScale(
      (CONVEYOR_CONST.SHAPE_CELL_WIDTH - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.width,
      (CONVEYOR_CONST.SHAPE_CELL_HEIGHT - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.height
    );
  }
}
