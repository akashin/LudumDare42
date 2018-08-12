import { CONST, GRID_CONST, CONVEYOR_CONST } from "../const/const";

export class MemoryCell extends Phaser.GameObjects.Sprite {
  constructor(scene, params) {
    // TODO: Use other texture for this type of cell.
    super(scene, params.x, params.y, 'cell');

    this.setOrigin(0, 0);
    this.setScale(
      (CONVEYOR_CONST.SHAPE_CELL_WIDTH - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.width,
      (CONVEYOR_CONST.SHAPE_CELL_HEIGHT - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.height
    );
    // Color in red to distinguish from grid cells.
    this.setTint(0xFF00FF);
  }
}
