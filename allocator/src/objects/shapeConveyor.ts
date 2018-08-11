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
    let SHAPE_COUNT = 5;

    for (var i = 0; i < SHAPE_COUNT; ++i) {
      let shape = new MemoryShapeOnConveyor(scene, MemoryShape.randomShape(), {x: i * 50, y: 0});
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

    let CELL_HEIGHT = 10;
    let CELL_WIDTH = 10;

    for (var w = 0; w < this.memoryShape.getWidth(); ++w) {
      for (var h = 0; h < this.memoryShape.getHeight(); ++h) {
        if (this.memoryShape.hasCell(w, h)) {
          console.log(w, h);
          let cell = scene.make.graphics({
            fillStyle: { color: "0xFFFFFF", alpha: 1.0 }
          }).fillRect(w * CELL_WIDTH, h * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
          this.add(cell);
        }
      }
    }

    scene.add.existing(this);
  }
}
