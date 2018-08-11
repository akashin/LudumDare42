import { CONST, GRID_CONST } from "../const/const";
import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { Robot, RobotType } from "../logic/robot";
import { Task } from "../logic/task";

export class MainScene extends Phaser.Scene {
  private grid: Array<Array<Phaser.GameObjects.Sprite>>;
  private robots: Array<Robot>;
  private shapeConveyor: ShapeConveyor;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.grid = new Array<Array<GridCell>>();
    this.robots = new Array<Robot>();
  }

  preload(): void {
    this.load.image('cell', 'assets/cell.png');
    this.load.image("engineer", "./assets/engineer.png");
  }

  create(): void {
    this.createGrid();

    this.shapeConveyor = new ShapeConveyor(this, {
      x: 100,
      y: 300
    });

    this.input.on('gameobjectdown', function (pointer, gameObject) {
      if (gameObject instanceof GridCell) {
        gameObject.setOccupied();
      }
    });

    this.input.on('gameobjectover', function (pointer, gameObject) {
      gameObject.setTint(0x7878ff);
    });

    this.input.on('gameobjectout', function (pointer, gameObject) {
      gameObject.clearTint();
    });
  }

  createGrid() {
    for (var h_index = 0; h_index < GRID_CONST.H_CELLS; ++h_index) {
      this.grid.push(new Array<GridCell>());
      for (var w_index = 0; w_index < GRID_CONST.W_CELLS; ++w_index) {
        let cell = new GridCell(this, {
          x: w_index * (GRID_CONST.CELL_WIDTH + GRID_CONST.CELL_BORDER_SIZE),
          y: h_index * (GRID_CONST.CELL_HEIGHT + GRID_CONST.CELL_BORDER_SIZE)
        });
        this.grid[h_index].push(cell);
      }
    }

    let robot = new Robot(this, 100 + 31 / 2, 100 + 31 / 2, RobotType.Engineer);
    this.robots.push(robot);

    let mask = new Array<Array<boolean>>();
    for (var x = 0; x < 3; ++x) {
      let column = Array<boolean>();
      for (var y = 0; y < 3; ++y) {
        column.push((x + y) % 2 == 0);
      }
      mask.push(column);
    }

    let task = new Task(1, 1, mask);
    robot.setTask(task);

    robot.addToContainer(this.shapeConveyor);
  }

  update(time, delta): void {
    delta /= 1000

    for (var i = 0; i < this.robots.length; ++i) {
      let robot: Robot = this.robots[i];
      robot.update(time, delta);
    }
  }
}
