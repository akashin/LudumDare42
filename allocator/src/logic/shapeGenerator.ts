import { randomInt } from "../logic/math";
import { MemoryShape } from "../objects/memoryShape";

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

  generateShape() : MemoryShape {
    let shape = this.shapes[randomInt(this.shapes.length)];
    for (var it = 0; it < randomInt(5); ++it) {
      shape = shape.rotatedClockwise();
    }
    return shape;
  }

  generateAntiShape() : MemoryShape {
    return this.antiShapes[randomInt(this.antiShapes.length)];
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

