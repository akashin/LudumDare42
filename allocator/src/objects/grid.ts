import { GridCell } from './gridCell';
import { GRID_CONST } from '../const/const';
import { MemoryShape } from './memoryShape';

export class Grid {
    private grid: Array<Array<Phaser.GameObjects.Sprite>>;
    private scene: Phaser.Scene;

    constructor(scene) {
        this.grid = new Array<Array<Phaser.GameObjects.Sprite>>();
        this.scene = scene;
    }

    createGrid(container: Phaser.GameObjects.Container) {
        for (var h_index = 0; h_index < GRID_CONST.H_CELLS; ++h_index) {
            this.grid.push(new Array<GridCell>());
            for (var w_index = 0; w_index < GRID_CONST.W_CELLS; ++w_index) {
            let cell = new GridCell(this.scene, {
                x: w_index * GRID_CONST.CELL_WIDTH,
                y: h_index * GRID_CONST.CELL_HEIGHT
            });
            cell.setInteractive();
            this.grid[h_index].push(cell);
            container.add(cell);
            }
        }
    }

    findCellIndex(cell: GridCell): [number, number] {
        for (var h_index = 0; h_index < GRID_CONST.H_CELLS; ++h_index) {
            for (var w_index = 0; w_index < GRID_CONST.W_CELLS; ++w_index) {
                if (this.grid[h_index][w_index] == cell) {
                    return [h_index, w_index];
                }
            }
        }

        return [-1, -1]
    }

    getAllOverlappedCells(cell: GridCell, memoryShape: MemoryShape): Array<GridCell> {
        var [row, column] = this.findCellIndex(cell);
        var overlapped_cells = new Array<GridCell>();
        for (var h_index = 0; 
            h_index < Math.min(memoryShape.getHeight(), GRID_CONST.H_CELLS - row); ++h_index) {
            for (var w_index = 0; 
                w_index < Math.min(memoryShape.getWidth(), GRID_CONST.W_CELLS - column); ++w_index) {
                    if (memoryShape.hasCell(w_index, h_index)) { 
                        overlapped_cells.push(this.grid[row + h_index][column + w_index] as GridCell);
                    }
            }
        }

        return overlapped_cells;
    }
}