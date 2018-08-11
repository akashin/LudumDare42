import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { GridCell } from "./gridCell";
import { TiledLayout, LayoutDirection } from "../utils/layout";

export class ShapeConveyor extends Phaser.GameObjects.Container {
  private shapes: Array<MemoryShapeOnConveyor>;
  private layout: TiledLayout;

  constructor(scene, params) {
    super(scene, params.x, params.y);

    this.shapes = new Array<MemoryShapeOnConveyor>();

    this.createShapes(scene);

    scene.add.existing(this);
  }

  createShapes(scene): void {
    let layout = new TiledLayout(scene, LayoutDirection.Horizontal, /* spacing = */ 30);
    for (var i = 0; i < CONVEYOR_CONST.SHAPE_COUNT; ++i) {
      let shape = new MemoryShapeOnConveyor(scene, MemoryShape.randomShape(), {
        x: 0,
        y: 0
      });
      console.log(shape.getBounds());
      this.shapes.push(shape);
      layout.addItem(shape);
    }
    this.add(layout);
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
          // TODO: Use a separate grid cell type.
          let cell = new GridCell(scene, {
            x: w * CONVEYOR_CONST.SHAPE_CELL_WIDTH,
            y: h * CONVEYOR_CONST.SHAPE_CELL_HEIGHT
          });
          this.add(cell);
        }
      }
    }

    scene.add.existing(this);
  }
}
