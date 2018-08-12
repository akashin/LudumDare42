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
    h_index: number;
    w_index: number;
    mask: Array<Array<boolean>>;
    private maskWidth: number;
    private maskHeight: number;
    underСonstruction: boolean;
    timer: number;

    constructor(type: TaskType, h_index: number, w_index: number, mask: Array<Array<boolean>>) {
        this.type = type;
        this.h_index = h_index;
        this.w_index = w_index;
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
        for (var h_index = 0; h_index < this.maskHeight; ++h_index) {
            for (var w_index = 0; w_index < this.maskWidth; ++w_index) {
                if (this.mask[h_index][w_index]) {
                    let gridCell: GridCell = grid.getCell(this.h_index + h_index, this.w_index + w_index);
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
