import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { Robot, RobotType } from "../logic/robot";

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
      y: 100
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
    let GRID_HEIGHT = 5;
    let GRID_WIDTH = 5;

    for (var i = 0; i < GRID_HEIGHT; ++i) {
      this.grid.push(new Array<GridCell>());
      for (var j = 0; j < GRID_WIDTH; ++j) {
        let cell = new GridCell({
          scene: this,
          x: 100 + i * 31,
          y: 100 + j * 31
        })
        this.grid[i].push(cell);
      }
    }

    let robot = new Robot(this, 100 + 31 / 2, 100 + 31 / 2, RobotType.Engineer);
    robot.setScale(31 / 256);
    this.robots.push(robot);

    robot.setDestinationPoint(100 + 31 * 3.5, 100 + 31 * 4.5);
  }

  update(time): void {
  }
}
