import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { MemoryShapeOnConveyor } from "./memoryShapeOnConveyor";
import { TiledLayout, LayoutDirection } from "../utils/layout";

export class ShapeConveyor extends Phaser.GameObjects.Container {
  private shapes: Array<MemoryShapeOnConveyor>;
  private layout: TiledLayout;
  private generationCounter: number = CONVEYOR_CONST.SHAPE_GEN_PERIOD;

  constructor(scene, params) {
    super(scene, params.x, params.y);

    this.shapes = new Array<MemoryShapeOnConveyor>();

    this.createShapes(scene);
  }

  createShapes(scene): void {
    this.layout = new TiledLayout(scene, LayoutDirection.Horizontal, /* spacing = */ 30);
    for (var i = 0; i < CONVEYOR_CONST.SHAPE_COUNT; ++i) {
      this.addNewShape(scene);
    }
    this.add(this.layout);
  }

  shapeCount(): number {
    return this.shapes.length;
  }

  addNewShape(scene): void {
    console.log("Adding shape");
    let shape = new MemoryShapeOnConveyor(scene, MemoryShape.randomShape(), {
      x: 0,
      y: 0
    });
    this.shapes.push(shape);
    this.layout.addItem(shape);
  }

  deleteShape(shape_on_conveyor: MemoryShapeOnConveyor) {
    console.log("Deleting shape");
    this.shapes = this.shapes.filter(shape => shape !== shape_on_conveyor);
    this.layout.removeItem(shape_on_conveyor);
  }

  update() {
    --this.generationCounter;
    if (this.generationCounter == 0) {
      if (this.shapeCount() < CONVEYOR_CONST.SHAPE_CAPACITY) {
        this.addNewShape(this.scene);
        this.generationCounter = CONVEYOR_CONST.SHAPE_GEN_PERIOD;
      } else {
        // TODO: Show end game screen.
      }
    }
  }
}
