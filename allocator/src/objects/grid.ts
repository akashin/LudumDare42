import { GridCell } from './gridCell';
import { GRID_CONST } from '../const/const';
import { MemoryShape } from './memoryShape';

export class Grid extends Phaser.GameObjects.Container {
  private grid: Array<Array<GridCell>>;

  constructor(scene) {
    super(scene);

    this.grid = new Array<Array<GridCell>>();
    this.createGrid(scene);
  }

  createGrid(scene): void {
    for (var row = 0; row < GRID_CONST.H_CELLS; ++row) {
      this.grid.push(new Array<GridCell>());
      for (var column = 0; column < GRID_CONST.W_CELLS; ++column) {
        let cell = new GridCell(scene, {
          x: column * GRID_CONST.CELL_WIDTH,
          y: row * GRID_CONST.CELL_HEIGHT,
          column: column,
          row: row,
        });
        cell.setInteractive();
        this.grid[row].push(cell);
        this.add(cell);
      }
    }
  }

  addObject(gameObject): void {
    this.add(gameObject);
  }

  isOutOfGrid(row: number, column: number) {
    return (row < 0 || row >= GRID_CONST.H_CELLS) || (column < 0 || column >= GRID_CONST.W_CELLS);
  }

  getAllOverlappedCells(cell: GridCell, memoryShape: MemoryShape): [Array<GridCell>, boolean] {
    var overlappedCells = new Array<GridCell>();
    var isOccupied = false;

    for (var shapeRow = 0; shapeRow < memoryShape.getHeight(); ++shapeRow) {
      for (var shapeColumn = 0; shapeColumn < memoryShape.getWidth(); ++shapeColumn) {
        let gridRow = cell.getRow() + shapeRow;
        let gridColumn = cell.getColumn() + shapeColumn;

        if (this.isOutOfGrid(gridRow, gridColumn)) {
          continue;
        }

        if (memoryShape.hasCell(shapeRow, shapeColumn)) {
          let currentCell = this.grid[gridRow][gridColumn];

          overlappedCells.push(currentCell);
          if (currentCell.isOccupied) {
            isOccupied = true;
          }
        }
      }
    }

    return [overlappedCells, isOccupied];
  }
}
