import { GridCell } from './gridCell';
import { GRID_CONST } from '../const/const';
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
}