import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST } from '../const/const';
import { Grid } from '../objects/grid';

export class Picker {
  private _pickedShape: MemoryShapeOnConveyor = null;
  private coveredCells: Array<GridCell> = null;
  private canPlace: boolean = false;

  constructor() {
  }

  get pickedShape(): MemoryShapeOnConveyor {
    return this._pickedShape;
  }

  set pickedShape(memoryShape: MemoryShapeOnConveyor) {
    if (this._pickedShape != null) {
      this._pickedShape.setChosen(false);
    }
    this._pickedShape = memoryShape;
  }

  onGridCellDown(gridCell: GridCell): boolean {
    if (!this.coveredCells) {
      return false;
    }
    if (!this.canPlace) {
      console.log("Placing on a forbidden space!");
      return false;
    }

    this.coveredCells.forEach((cell) => { cell.isOccupied = true; });
    this.onGridCellOut(gridCell);
    this.coveredCells = null;
    return true;
  }

  onGridCellHover(gridCell: GridCell, grid: Grid): void {
    if (!this.pickedShape) {
      return;
    }

    [this.coveredCells, this.canPlace] =
      grid.getCoveredCells(gridCell, this.pickedShape.getMemoryShape());

    this.coveredCells.forEach((cell) => { cell.setHovered(this.canPlace); });
  }

  onGridCellOut(gridCell: GridCell): void {
    if (!this.pickedShape) {
      return;
    }

    this.coveredCells.forEach((cell) => { cell.clearHover(); });
  }
}
