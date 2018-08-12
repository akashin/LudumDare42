import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST } from '../const/const';
import { Grid } from '../objects/grid';
import { Task, TaskType } from '../logic/task'
import { ShapeType } from '../logic/shapeType'

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

  getTaskType(shapeType: ShapeType) {
    if (this.pickedShape.shapeType == ShapeType.Creator) {
      return TaskType.ALLOCATE;
    }
    if (this.pickedShape.shapeType == ShapeType.Eraser) {
      return TaskType.FREE;
    }
    alert("Unrecognized shape type.");
  }

  onGridCellDown(gridCell: GridCell, placementCallback) {
    if (!this.coveredCells) {
      return;
    }
    if (!this.canPlace) {
      console.log("Placing on a forbidden space!");
      return;
    }

    let task: Task = new Task(
      this.getTaskType(this.pickedShape.shapeType),
      gridCell.getRow(),
      gridCell.getColumn(),
      this.pickedShape.memoryShape.mask
    );    
    placementCallback(task);

    this.clear();
    return;
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

  clear() {
    if (!this.pickedShape) {
      return;
    }
    this.coveredCells.forEach((cell) => { cell.clearHover(); });
    this.coveredCells = null;  
    this.canPlace = true;
    this.pickedShape = null;
  }
}
