import { CONST, GRID_CONST, CONVEYOR_CONST } from "../const/const";
import { ShapeType } from "../logic/shapeType";

export class MemoryCell extends Phaser.GameObjects.Sprite {
  static getTexture(type: ShapeType) : string {
    if (type == ShapeType.Creator) {
      return 'positive_atom';
    } else if (type == ShapeType.Eraser) {
      return 'negative_atom';
    } else {
      alert("Wrong shape type!");
      return '';
    }
  }

  constructor(scene, params) {
    super(scene, params.x, params.y, '');

    this.setTexture(MemoryCell.getTexture(params.shapeType));

    this.setOrigin(0, 0);
    this.setScale(
      (CONVEYOR_CONST.SHAPE_CELL_WIDTH - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.width,
      (CONVEYOR_CONST.SHAPE_CELL_HEIGHT - CONVEYOR_CONST.SHAPE_CELL_BORDER_SIZE) / this.height
    );
  }
}
