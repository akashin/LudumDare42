import { randomInt } from "../logic/math";
import { MemoryShape } from "../objects/memoryShape";

export class ShapeGenerator {
  private shapes = new Array<MemoryShape>();
  private antiShapes = new Array<MemoryShape>();

  constructor() {
    this.initShapes();
  }

  addShape(strMask: Array<string>, container: Array<MemoryShape>) {
    let shape = new MemoryShape();
    for (let row of strMask) {
      let shapeRow = new Array<boolean>();
      for (let i = 0; i < row.length; i++) {
        shapeRow.push(row.charAt(i) == "#")
      }
      shape.mask.push(shapeRow);
    }
    container.push(shape);
  }

  initShapes() {
    for (let shape of SHAPES) {
      this.addShape(shape, this.shapes);
    }

    for (let antiShape of ANTI_SHAPES) {
      this.addShape(antiShape, this.antiShapes);
    }
  }

  generateShape() : MemoryShape {
    return this.shapes[randomInt(this.shapes.length)];
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

