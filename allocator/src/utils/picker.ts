import { MemoryShapeOnConveyor } from '../objects/memoryShapeOnConveyor';
import { GridCell } from '../objects/gridCell';
import { COLOR_CONST } from '../const/const';
import { Grid } from '../objects/grid';

export class Picker {
    private _memoryShapeOnConveyor: MemoryShapeOnConveyor = null;
    private _memoryShapeAndGridOverlap: Array<GridCell>;
    private _isOccupiedPlacement: boolean;

    get memoryShapeOnConveyor(): MemoryShapeOnConveyor {
        return this._memoryShapeOnConveyor;
    }

    set memoryShapeOnConveyor(memory_shape: MemoryShapeOnConveyor) {
        if (this._memoryShapeOnConveyor != null) {
            this._memoryShapeOnConveyor.setChosen(false);
        }
        this._memoryShapeOnConveyor = memory_shape;
    }

    get memoryShapeAndGridOverlap(): Array<GridCell> {
        return this._memoryShapeAndGridOverlap;
    }

    set memoryShapeAndGridOverlap(overlap: Array<GridCell>) {
        this._memoryShapeAndGridOverlap = overlap;
    }

    get isOccupiedPlacement(): boolean {
        return this._isOccupiedPlacement;
    }

    set isOccupiedPlacement(is_occupied_placement: boolean) {
        this._isOccupiedPlacement = is_occupied_placement;
    }

    onGridCellDown(grid_cell: GridCell) {
        if (this.memoryShapeAndGridOverlap != null) {
            if (this.isOccupiedPlacement) {
                console.log("Placing on a forbidden space!");
            }
            else {
                this.memoryShapeAndGridOverlap.forEach((value) => {value.setIsOccupied(true)});
            }
        }
        else {
            grid_cell.setIsOccupied(true);
        }
    }

    onGridCellHower(grid_cell: GridCell, grid: Grid) {
        if (this.memoryShapeOnConveyor != null) {
            [this.memoryShapeAndGridOverlap, this.isOccupiedPlacement] = 
              grid.getAllOverlappedCells(grid_cell, this.memoryShapeOnConveyor.getMemoryShape());
            
            if (this.isOccupiedPlacement) {
                this.memoryShapeAndGridOverlap.forEach((value) => {value.setTint(COLOR_CONST.OCCUPIED_HOVER)});  
            }
            else {
                this.memoryShapeAndGridOverlap.forEach((value) => {value.setTint(COLOR_CONST.UNOCCUPIED_HOVER)});  
            }
        }
        else if (grid_cell.getIsOccupied()){
            grid_cell.setTint(COLOR_CONST.OCCUPIED_HOVER);
        } 
        else {
            grid_cell.setTint(COLOR_CONST.UNOCCUPIED_HOVER);
        }
    }

    onGridCellOut(grid_cell: GridCell) {
        if (this.memoryShapeAndGridOverlap != null) {
            this.memoryShapeAndGridOverlap.forEach((value) => {value.clearTint()});
        }
        else {
            grid_cell.clearTint();
        }
    }
}