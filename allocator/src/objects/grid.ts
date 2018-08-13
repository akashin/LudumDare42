import { GridCell } from './gridCell';
import { GRID_CONST } from '../const/const';
import { MemoryShape } from './memoryShape';
import { ShapeType } from '../logic/shapeType';

export class Grid extends Phaser.GameObjects.Container {
  private grid: Array<Array<GridCell>>;
  private background: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.grid = new Array<Array<GridCell>>();

    this.background = scene.make.sprite({}, false);
    this.background.setTexture("table");
    this.background.setPosition(0, 0);
    this.background.setOrigin(0, 0);
    this.add(this.background);

    this.createGrid(scene);
  }

  createGrid(scene): void {
    for (var row = 0; row < GRID_CONST.H_CELLS; ++row) {
      this.grid.push(new Array<GridCell>());
      for (var column = 0; column < GRID_CONST.W_CELLS; ++column) {
        let cell = new GridCell(scene, {
          x: GRID_CONST.BORDER_SIZE + column * GRID_CONST.CELL_WIDTH,
          y: GRID_CONST.BORDER_SIZE + row * GRID_CONST.CELL_HEIGHT,
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

  getCoveredCells(cell: GridCell,
                  memoryShape: MemoryShape,
                  shapeType: ShapeType): [Array<GridCell>, boolean] {
    var coveredCells = new Array<GridCell>();
    var canPlace = true;

    for (var shapeRow = 0; shapeRow < memoryShape.getHeight(); ++shapeRow) {
      for (var shapeColumn = 0; shapeColumn < memoryShape.getWidth(); ++shapeColumn) {
        // Skip all cells that are not set.
        if (!memoryShape.hasCell(shapeRow, shapeColumn)) {
          continue;
        }

        let gridRow = cell.getRow() + shapeRow;
        let gridColumn = cell.getColumn() + shapeColumn;
        if (this.isOutOfGrid(gridRow, gridColumn)) {
          canPlace = false;
          continue;
        }

        let currentCell = this.grid[gridRow][gridColumn];
        coveredCells.push(currentCell);

        if (!currentCell.isSuitableFor(shapeType)) {
          canPlace = false;
        }
      }
    }

    return [coveredCells, canPlace];
  }

  getCell(row: number, column: number): GridCell {
    return this.grid[row][column] as GridCell;
  }
}
