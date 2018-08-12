import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { ShapeGenerator } from "../logic/shapeGenerator";
import { MemoryShapeOnConveyor } from "./memoryShapeOnConveyor";
import { TiledLayout, LayoutDirection } from "../utils/layout";

export class ShapeConveyor extends Phaser.GameObjects.Container {
  private shapes: Array<MemoryShapeOnConveyor>;
  private shapeGenerator: ShapeGenerator;
  private layout: TiledLayout;
  private generationCounter: number;

  constructor(scene, params) {
    super(scene, params.x, params.y);

    this.initBegin();
    this.shapeGenerator = params.shapeGenerator;

    this.createShapes(scene);
  }

  private initBegin() {
    this.shapes = new Array<MemoryShapeOnConveyor>();
    this.generationCounter = CONVEYOR_CONST.SHAPE_GEN_PERIOD;
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

  isFull(): boolean {
    return this.shapes.length == CONVEYOR_CONST.SHAPE_CAPACITY;
  }

  addNewShape(scene): void {
    console.log("Adding shape");
    let [shape, shapeType] = this.shapeGenerator.generateShape();
    let shapeOnConveyor = new MemoryShapeOnConveyor(scene, shape, shapeType, {
      x: 0,
      y: 0
    });
    this.shapes.push(shapeOnConveyor);
    this.layout.addItem(shapeOnConveyor);
  }

  deleteShape(shapeOnConveyor: MemoryShapeOnConveyor) {
    console.log("Deleting shape");
    // TODO: There is probably a method on the container.
    this.shapes = this.shapes.filter(shape => shape !== shapeOnConveyor);
    this.layout.removeItem(shapeOnConveyor);
  }

  update() {
    --this.generationCounter;
    if (this.generationCounter == 0) {
      if (this.shapeCount() < CONVEYOR_CONST.SHAPE_CAPACITY) {
        this.addNewShape(this.scene);
      } else {
        console.log("Conveyor is full.");
      }
      this.generationCounter = CONVEYOR_CONST.SHAPE_GEN_PERIOD;
    }
  }

  clear() {
    this.shapes.map((shape) => {
      this.layout.removeItem(shape);
    });
    this.initBegin();
  }
}
