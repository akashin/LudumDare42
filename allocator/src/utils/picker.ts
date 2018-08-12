import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST } from '../const/const';
import { Grid } from '../objects/grid';

export class Picker {
    private _memoryShapeOnConveyor: MemoryShapeOnConveyor = null;
    private memoryShapeAndGridOverlap: Array<GridCell>;
    private isOccupiedPlacement: boolean = false;

    constructor() {
    }

    get memoryShapeOnConveyor(): MemoryShapeOnConveyor {
      return this._memoryShapeOnConveyor;
    }

    set memoryShapeOnConveyor(memoryShape: MemoryShapeOnConveyor) {
      if (this._memoryShapeOnConveyor != null) {
        this._memoryShapeOnConveyor.setChosen(false);
      }
      this._memoryShapeOnConveyor = memoryShape;
    }

    onGridCellDown(gridCell: GridCell): boolean {
      if (this.memoryShapeAndGridOverlap != null) {
        if (this.isOccupiedPlacement) {
          console.log("Placing on a forbidden space!");
        }
        else {
          this.memoryShapeAndGridOverlap.forEach((value) => {value.setIsOccupied(true)});
          this.onGridCellOut(gridCell);
          this.memoryShapeAndGridOverlap = null;

          return true;
        }
      }
      else {
        gridCell.setIsOccupied(true);
      }

      return false;
    }

    onGridCellHover(gridCell: GridCell, grid: Grid) {
      if (this.memoryShapeOnConveyor != null) {
        [this.memoryShapeAndGridOverlap, this.isOccupiedPlacement] =
          grid.getAllOverlappedCells(gridCell, this.memoryShapeOnConveyor.getMemoryShape());

        if (this.isOccupiedPlacement) {
          this.memoryShapeAndGridOverlap.forEach((value) => {value.setTint(COLOR_CONST.OCCUPIED_HOVER)});
        } else {
          this.memoryShapeAndGridOverlap.forEach((value) => {value.setTint(COLOR_CONST.UNOCCUPIED_HOVER)});
        }
      } else if (gridCell.getIsOccupied()){
        gridCell.setTint(COLOR_CONST.OCCUPIED_HOVER);
      } else {
        gridCell.setTint(COLOR_CONST.UNOCCUPIED_HOVER);
      }
    }

    onGridCellOut(gridCell: GridCell) {
      if (this.memoryShapeAndGridOverlap != null) {
        this.memoryShapeAndGridOverlap.forEach((value) => {value.clearTint()});
      }
      else {
        gridCell.clearTint();
      }
    }
}
