import {randomInt} from "../logic/math";

export class MemoryShape {
  mask: Array<Array<boolean>>;

  private static shapes = new Array<MemoryShape>();
  private static antiShapes = new Array<MemoryShape>();

  private static addShape(strMask: Array<string>, container: Array<MemoryShape>) {
    let shape = new MemoryShape();
    for (let row of strMask) {
      let shapeRow = new Array<boolean>();
      for (let i = 0; i < row.length; i++) {
        shapeRow.push(row.charAt(i) == '#')
      }
      shape.mask.push(shapeRow);
    }
    container.push(shape);
  }

  static initShapes() {
    MemoryShape.addShape([
      "#  ",
      "###"
    ], MemoryShape.shapes);
    MemoryShape.addShape([
      "##",
      "##"
    ], MemoryShape.shapes);
    MemoryShape.addShape([
      "## ",
      " ##"
    ], MemoryShape.shapes);
    MemoryShape.addShape([
      "##",
      " #",
      " #"
    ], MemoryShape.shapes);
    MemoryShape.addShape([
      " # ",
      "###"
    ], MemoryShape.shapes);
    MemoryShape.addShape([
      "###",
      "  #"
    ], MemoryShape.shapes);

    MemoryShape.addShape([
      "###",
      "###",
      "###"
    ], MemoryShape.antiShapes);
    MemoryShape.addShape([
      " # ",
      "###",
      " # "
    ], MemoryShape.antiShapes);
    MemoryShape.addShape([
      "#####"
    ], MemoryShape.antiShapes);
    MemoryShape.addShape([
      "#",
      "#",
      "#",
      "#",
      "#"
    ], MemoryShape.antiShapes);
  }

  static randomShape() : MemoryShape {
    return MemoryShape.shapes[randomInt(MemoryShape.shapes.length)];
  }

  static randomAntiShape() : MemoryShape {
    return MemoryShape.antiShapes[randomInt(MemoryShape.antiShapes.length)];
  }

  constructor() {
    this.mask = new Array<Array<boolean>>();
  }

  hasCell(x: number, y: number): boolean {
    return this.mask[y][x];
  }

  getHeight(): number {
    return this.mask.length;
  }

  getWidth(): number {
    return this.mask[0].length;
  }
}

MemoryShape.initShapes();
