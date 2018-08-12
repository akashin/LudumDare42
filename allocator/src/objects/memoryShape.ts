export class MemoryShape {
  mask: Array<Array<boolean>>;

  constructor() {
    this.mask = new Array<Array<boolean>>();
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
}
