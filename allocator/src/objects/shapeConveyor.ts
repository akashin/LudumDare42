import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";

export class ShapeConveyor extends Phaser.GameObjects.Container {
  private shapes: Array<MemoryShapeOnConveyor>;

  constructor(scene, params) {
    super(scene, params.x, params.y);

    this.shapes = new Array<MemoryShapeOnConveyor>();

    this.createShapes(scene);

    scene.add.existing(this);
  }

  createShapes(scene): void {
    // TODO: Use horizontal layout here.
    for (var i = 0; i < CONVEYOR_CONST.SHAPE_COUNT; ++i) {
      let shape = new MemoryShapeOnConveyor(scene, MemoryShape.randomShape(), {
        x: i * CONVEYOR_CONST.SHAPE_CELL_WIDTH * 5,
        y: 0
      });
      this.shapes.push(shape);
    }
    this.add(this.shapes);
  }
}

class MemoryShapeOnConveyor extends Phaser.GameObjects.Container {
  private memoryShape: MemoryShape;

  constructor(scene, shape, params) {
    super(scene, params.x, params.y);

    this.memoryShape = shape;

    for (var w = 0; w < this.memoryShape.getWidth(); ++w) {
      for (var h = 0; h < this.memoryShape.getHeight(); ++h) {
        if (this.memoryShape.hasCell(w, h)) {
          let cell = scene.make.graphics({
            fillStyle: { color: CONVEYOR_CONST.SHAPE_COLOR, alpha: 1.0 }
          }).fillRect(
            w * CONVEYOR_CONST.SHAPE_CELL_WIDTH,
            h * CONVEYOR_CONST.SHAPE_CELL_HEIGHT,
            CONVEYOR_CONST.SHAPE_CELL_WIDTH,
            CONVEYOR_CONST.SHAPE_CELL_HEIGHT
          );
          this.add(cell);
        }
      }
    }

    scene.add.existing(this);
  }
}
