import { CONST, GRID_CONST } from "../const/const";
import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { MemoryShapeOnConveyor } from "../objects/memoryShapeOnConveyor";
import { Robot, RobotType } from "../logic/robot";
import { Task } from "../logic/task";
import { TiledLayout, LayoutDirection } from "../utils/layout";

export class MainScene extends Phaser.Scene {
  private grid: Array<Array<Phaser.GameObjects.Sprite>>;
  private robots: Array<Robot>;
  private shapeConveyor: ShapeConveyor;
  private memoryContainer: Phaser.GameObjects.Container;
  private gameLayout: TiledLayout;
  private chosenMemoryShape: MemoryShapeOnConveyor = null;

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
    this.gameLayout = new TiledLayout(
      this,
      LayoutDirection.Vertical,
      /* spacing = */ 100,
      /* center_elements = */ true
    );

    this.shapeConveyor = new ShapeConveyor(this, {
      x: 100,
      y: 300
    });

    this.memoryContainer = this.add.container(0, 0);
    this.createGrid(this.memoryContainer);

    this.createRobots();

    this.setupInputs();
  }

  setupInputs() {
    this.input.on('gameobjectdown', function (pointer, gameObject) {
      if (gameObject instanceof GridCell) {
        gameObject.setOccupied();
      }
    });

    this.input.on('gameobjectover', function (pointer, gameObject) {
      if (gameObject instanceof GridCell) {
        gameObject.setTint(0x7878ff);
      }
    });

    this.input.on('gameobjectout', function (pointer, gameObject) {
      if (gameObject instanceof GridCell) {
        gameObject.clearTint();
      }
    });
  }

  createGrid(container: Phaser.GameObjects.Container) {
    for (var h_index = 0; h_index < GRID_CONST.H_CELLS; ++h_index) {
      this.grid.push(new Array<GridCell>());
      for (var w_index = 0; w_index < GRID_CONST.W_CELLS; ++w_index) {
        let cell = new GridCell(this, {
          x: w_index * GRID_CONST.CELL_WIDTH,
          y: h_index * GRID_CONST.CELL_HEIGHT
        });
        cell.setInteractive();
        this.grid[h_index].push(cell);
        container.add(cell);
      }
    }
  }

  createRobots() {
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

    robot.addToContainer(this.memoryContainer);
  }

  setChosenMemoryShape(memoryShape: MemoryShapeOnConveyor) {
    console.log("Shape on conveyor clicked");
    if (this.chosenMemoryShape != null) {
      this.chosenMemoryShape.setChosen(false);
    }
    this.chosenMemoryShape = memoryShape;
  }

  update(time, delta): void {
    delta /= 1000

    for (var i = 0; i < this.robots.length; ++i) {
      let robot: Robot = this.robots[i];
      robot.update(time, delta);
    }
  }
}
