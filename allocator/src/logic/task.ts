import { Vec2 } from "./math"
import { CellStatus } from "../objects/gridCell";
import { Grid } from '../objects/grid'
import { GridCell } from '../objects/gridCell'
import { GRID_CONST } from '../const/const'

export enum TaskType {
    ALLOCATE,
    FREE,
}

export class Task {
    type: TaskType;
    row: number;
    column: number;
    mask: Array<Array<boolean>>;
    private maskWidth: number;
    private maskHeight: number;
    underСonstruction: boolean;
    timer: number;

    constructor(type: TaskType, row: number, column: number, mask: Array<Array<boolean>>) {
        this.type = type;
        this.row = row;
        this.column = column;
        this.mask = mask;
        this.underСonstruction = false;
        this.timer = 60;

        this.maskHeight = mask.length;
        this.maskWidth = mask[0].length;
    }

    update(): void {
        this.timer = Math.max(0, this.timer - 1);
    }

    isFinished(): boolean {
        return this.timer == 0;
    }

    updateGrid(grid: Grid): void {
        for (var row = 0; row < this.maskHeight; ++row) {
            for (var column = 0; column < this.maskWidth; ++column) {
                if (this.mask[row][column]) {
                    let gridCell: GridCell = grid.getCell(this.row + row, this.column + column);
                    if (this.isFinished()) {
                        if (this.type == TaskType.ALLOCATE) {
                            gridCell.setStatus(CellStatus.ALLOCATED);
                        } else {
                            gridCell.setStatus(CellStatus.FREE);
                        }
                    } else {
                        if (this.type == TaskType.ALLOCATE) {
                            gridCell.setStatus(CellStatus.ALLOCATING);
                        } else {
                            gridCell.setStatus(CellStatus.FREEING);
                        }
                    }
                }
            }
        }
    }
}
