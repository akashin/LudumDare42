import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST } from '../const/const';
import { Grid } from '../objects/grid';
import { Task, TaskType } from '../logic/task'

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

  onGridCellDown(gridCell: GridCell): [boolean, Task] {
    if (!this.coveredCells) {
      return [false, null];
    }
    if (!this.canPlace) {
      console.log("Placing on a forbidden space!");
      return [false, null];
    }

    let task: Task = new Task(
      TaskType.ALLOCATE,
      gridCell.getRow(),
      gridCell.getColumn(),
      this.pickedShape.memoryShape.mask
    );
    this.onGridCellOut(gridCell);
    this.coveredCells = null;
    return [true, task];
  }

  onGridCellHover(gridCell: GridCell, grid: Grid): void {
    if (!this.pickedShape) {
      return;
    }

    [this.coveredCells, this.canPlace] =
      grid.getCoveredCells(gridCell, this.pickedShape.memoryShape, this.pickedShape.shapeType);

    this.coveredCells.forEach((cell) => { cell.setHovered(this.canPlace); });
  }

  onGridCellOut(gridCell: GridCell): void {
    if (!this.pickedShape) {
      return;
    }

    this.coveredCells.forEach((cell) => { cell.clearHover(); });
  }
}
