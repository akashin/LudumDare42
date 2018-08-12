import { randomInt } from "../logic/math";
import { MemoryShape } from "../objects/memoryShape";
import { ShapeType } from "../logic/shapeType";

export class ShapeGenerator {
  private shapes = new Array<MemoryShape>();
  private antiShapes = new Array<MemoryShape>();

  constructor() {
    this.initShapes();
  }

  initShapes() {
    for (let shape of SHAPES) {
      this.shapes.push(MemoryShape.fromString(shape));
    }

    for (let shape of ANTI_SHAPES) {
      this.antiShapes.push(MemoryShape.fromString(shape));
    }
  }

  generateShape() : [MemoryShape, ShapeType] {
    let shape = this.shapes[randomInt(this.shapes.length)];
    for (var it = 0; it < randomInt(5); ++it) {
      shape = shape.rotatedClockwise();
    }
    // TODO: Make this more extensible.
    let shapeType = ShapeType.Creator;
    if (randomInt(2) == 0) {
      shapeType = ShapeType.Eraser;
    }
    return [shape, shapeType];
  }

}

let SHAPES = [
  [
    "#  ",
    "###"
  ],
  [
    "##",
    "##"
  ],
  [
    "## ",
    " ##"
  ],
  [
    "##",
    " #",
    " #"
  ],
  [
    " # ",
    "###"
  ],
  [
    "###",
    "  #"
  ]
];

let ANTI_SHAPES = [
  [
    "###",
    "###",
    "###"
  ],
  [
    " # ",
    "###",
    " # "
  ],
  [
    "#####"
  ],
  [
    "#",
    "#",
    "#",
    "#",
    "#"
  ],
];

