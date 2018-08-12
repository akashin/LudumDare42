import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST } from '../const/const';
import { Grid } from '../objects/grid';

export class Picker {
    private _pickedShape: MemoryShapeOnConveyor = null;
    private memoryShapeAndGridOverlap: Array<GridCell> = null;
    private isOccupiedPlacement: boolean = false;

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
      if (this.memoryShapeAndGridOverlap) {
        if (this.isOccupiedPlacement) {
          console.log("Placing on a forbidden space!");
        } else {
          this.memoryShapeAndGridOverlap.forEach((value) => {value.isOccupied = true});
          this.onGridCellOut(gridCell);
          this.memoryShapeAndGridOverlap = null;

          return true;
        }
      }
      else {
        gridCell.isOccupied = true;
      }

      return false;
    }

    onGridCellHover(gridCell: GridCell, grid: Grid) {
      if (this.pickedShape) {
        [this.memoryShapeAndGridOverlap, this.isOccupiedPlacement] =
          grid.getAllOverlappedCells(gridCell, this.pickedShape.getMemoryShape());

        if (this.isOccupiedPlacement) {
          this.memoryShapeAndGridOverlap.forEach((value) => {value.setTint(COLOR_CONST.OCCUPIED_HOVER)});
        } else {
          this.memoryShapeAndGridOverlap.forEach((value) => {value.setTint(COLOR_CONST.UNOCCUPIED_HOVER)});
        }
      } else if (gridCell.isOccupied){
        gridCell.setTint(COLOR_CONST.OCCUPIED_HOVER);
      } else {
        gridCell.setTint(COLOR_CONST.UNOCCUPIED_HOVER);
      }
    }

    onGridCellOut(gridCell: GridCell) {
      if (this.memoryShapeAndGridOverlap != null) {
        this.memoryShapeAndGridOverlap.forEach((value) => {value.clearTint()});
      } else {
        gridCell.clearTint();
      }
    }
}
