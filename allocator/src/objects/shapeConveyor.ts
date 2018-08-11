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
      let shape = new MemoryShapeOnConveyor(scene, MemoryShape.randomShape(), {x: 0, y: 0});
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

    let g = scene.add.graphics({
      x: 10,
      y: 10,
      fillStyle: { color: "0xFFFFFF", alpha: 1.0 }
    }).fillRect(100, 100, 100, 100);
    this.add(g);

    scene.add.existing(this);
  }
}
