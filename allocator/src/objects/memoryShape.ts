export class MemoryShape {
  private mask: Array<Array<boolean>>;

  constructor() {
    this.mask = new Array<Array<boolean>>();
  }

  hasCell(x: number, y: number): boolean {
    return false;
  }
}
