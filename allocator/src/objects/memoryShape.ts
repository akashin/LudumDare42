export class MemoryShape {
  mask: Array<Array<boolean>>;

  constructor(height: number = 0, width: number = 0) {
    this.mask = new Array<Array<boolean>>(height);
    for (var row = 0; row < height; ++row) {
      this.mask[row] = new Array<boolean>(width);
      for (var column = 0; column < width; ++column) {
        this.mask[row][column] = false;
      }
    }
  }

  static fromString(str: Array<string>): MemoryShape {
    let height = str.length;
    let width = str[0].length;

    let shape = new MemoryShape(height, width);
    for (let row = 0; row < height; ++row) {
      for (let column = 0; column < width; column++) {
        shape.mask[row][column] = str[row][column] == "#";
      }
    }
    return shape;
  }

  toString(): string {
    var str = "";
    for (let row = 0; row < this.getHeight(); ++row) {
      for (let column = 0; column < this.getWidth(); column++) {
        str += this.mask[row][column] ? "#" : " ";
      }
      str += "\n";
    }
    return str;
  }

  hasCell(row: number, column: number): boolean {
    return this.mask[row][column];
  }

  getHeight(): number {
    return this.mask.length;
  }

  getWidth(): number {
    return this.mask[0].length;
  }

  rotatedClockwise(): MemoryShape {
    let height = this.getWidth();
    let width = this.getHeight();
    let rotated = new MemoryShape(height, width);
    for (let row = 0; row < this.getHeight(); ++row) {
      for (let column = 0; column < this.getWidth(); column++) {
        rotated.mask[column][this.getHeight() - 1 - row] = this.mask[row][column];
      }
    }
    return rotated;
  }
}
