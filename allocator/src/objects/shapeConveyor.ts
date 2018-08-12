import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { ShapeGenerator } from "../logic/shapeGenerator";
import { MemoryShapeOnConveyor } from "./memoryShapeOnConveyor";
import { TiledLayout, LayoutDirection } from "../utils/layout";

export class ShapeConveyor extends Phaser.GameObjects.Container {
  private shapes: Array<MemoryShapeOnConveyor>;
  private shapeGenerator: ShapeGenerator;
  private layout: TiledLayout;
  private conveyor: Phaser.GameObjects.Sprite;
  private generationCounter: number;

  constructor(scene, params) {
    super(scene, params.x, params.y);

    this.initBegin();
    this.shapeGenerator = params.shapeGenerator;

    this.layout = new TiledLayout(scene, LayoutDirection.Horizontal, /* spacing = */ 30);

    this.conveyor = scene.make.tileSprite({
      x: 100,
      y: 50,
      width: 128,
      height: 128,
      key: 'conveyor',
      add: true
    });
    //this.add(this.conveyor);

    this.add(this.layout);

    this.createShapes(scene);
  }

  private initBegin() {
    this.shapes = new Array<MemoryShapeOnConveyor>();
    this.generationCounter = CONVEYOR_CONST.SHAPE_GEN_PERIOD;
  }

  createShapes(scene): void {
    for (var i = 0; i < CONVEYOR_CONST.SHAPE_COUNT; ++i) {
      this.addNewShape(scene);
    }
  }

  shapeCount(): number {
    return this.shapes.length;
  }

  isFull(): boolean {
    return this.shapes.length == CONVEYOR_CONST.SHAPE_CAPACITY;
  }

  getShapeX(index: number) {
    let spacing = 30;
    let x = 0;

    for (let i = 0; i < index; i++) {
      x += this.shapes[i].getBounds().width;
      x += spacing;
    }

    return x;
  }

  addNewShape(scene): void {
    console.log("Adding shape");
    let [shape, shapeType] = this.shapeGenerator.generateShape();
    let shapeOnConveyor = new MemoryShapeOnConveyor(scene, shape, shapeType, {
      x: this.getShapeX(this.shapes.length),
      y: 0
    });
    this.shapes.push(shapeOnConveyor);
    this.add(shapeOnConveyor);
  }

  deleteShape(shapeOnConveyor: MemoryShapeOnConveyor) {
    console.log("Deleting shape");
    // TODO: There is probably a method on the container.
    this.shapes = this.shapes.filter(shape => shape !== shapeOnConveyor);
    this.remove(shapeOnConveyor);

    for (let i = 0; i < this.shapes.length; i++) {
      let targetX = this.getShapeX(i);
      if (this.shapes[i].x != targetX) {
        this.shapes[i].moveAnimated(targetX);
      }
    }

    this.generationCounter += CONVEYOR_CONST.SHAPE_GEN_ACTION_DELAY;
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
      this.remove(shape);
    });
    this.initBegin();
  }
}
