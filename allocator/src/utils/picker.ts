import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST, GRID_CONST } from '../const/const';
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

  onGridCellDown(pointer, gridCell: GridCell, grid: Grid, placementCallback) {
    if (!this.pickedShape || !this.coveredCells) {
      return;
    }
    if (!this.canPlace) {
      console.log("Placing on a forbidden space!");
      return;
    }

    let centerCell = this.getCenterCell(pointer, gridCell, grid);
    if (!centerCell) {
      return;
    }

    let task: Task = new Task(
      this.getTaskType(this.pickedShape.shapeType),
      centerCell.getRow(),
      centerCell.getColumn(),
      this.pickedShape.memoryShape.mask
    );
    placementCallback(task);

    this.clear();
    return;
  }

  getXYwrtScene(object: any) : [number, number] {
    let x = 0;
    let y = 0;
    while (object != null) {
      x += object.x;
      y += object.y;
      object = object.parentContainer;
    }
    return [x, y];
  }

  getCenterCell(pointer, gridCell: GridCell, grid: Grid) {
    //return gridCell;
    let [x, y] = this.getXYwrtScene(gridCell);
    let dx = pointer.x - x;
    let dy = pointer.y - y;
    let height = GRID_CONST.CELL_HEIGHT;
    let width = GRID_CONST.CELL_WIDTH;

    let midRow = (this.pickedShape.memoryShape.getHeight() - 1) / 2;
    let midColumn = (this.pickedShape.memoryShape.getWidth() - 1) / 2;

    let posX = (gridCell.getColumn() - midColumn) * width + dx;
    let posY = (gridCell.getRow() - midRow) * height + dy;

    let column = Math.floor(posX / width);
    let row = Math.floor(posY / height);
    //console.log(dx, width, dy, height);

    if (row < 0 || column < 0) {
      return null;
    }
    return grid.getCell(row, column);
  }

  onGridCellHover(pointer, gridCell: GridCell, grid: Grid): void {
    if (!this.pickedShape) {
      return;
    }

    let centerCell = this.getCenterCell(pointer, gridCell, grid);
    if (!centerCell) {
      return;
    }

    if (this.coveredCells) {
      this.coveredCells.forEach((cell) => { cell.clearHover(); });
    }

    [this.coveredCells, this.canPlace] =
      grid.getCoveredCells(centerCell, this.pickedShape.memoryShape, this.pickedShape.shapeType);

    this.coveredCells.forEach((cell) => { cell.setHovered(this.canPlace); });
  }

  onGridCellOut(gridCell: GridCell): void {
    if (!this.pickedShape || !this.coveredCells) {
      return;
    }

    this.coveredCells.forEach((cell) => { cell.clearHover(); });
  }

  clear() {
    if (this.coveredCells != null) {
      this.coveredCells.forEach((cell) => { cell.clearHover(); });
      this.coveredCells = null;  
    }
    this.canPlace = true;
    this.pickedShape = null;
  }
}
