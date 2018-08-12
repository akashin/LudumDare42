import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { MemoryShapeOnConveyor } from "../objects/memoryShapeOnConveyor";
import { Robot, RobotType } from "../logic/robot";
import { Task } from "../logic/task";
import { TiledLayout, LayoutDirection } from "../utils/layout";
import { Grid } from "../objects/grid";
import { Picker } from '../utils/picker';

export class MainScene extends Phaser.Scene {
  private grid: Grid;
  private robots: Array<Robot>;
  private shapeConveyor: ShapeConveyor;
  private memoryContainer: Phaser.GameObjects.Container;
  private gameLayout: TiledLayout;
  private picker: Picker;

  private accumulatedDelta: number = 0;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.grid = new Grid(this);
    this.robots = new Array<Robot>();
    this.picker = new Picker();
  }

  preload(): void {
    this.load.image('cell', 'assets/cell.png');
    this.load.image("engineer", "./assets/engineer.png");
  }

  create(): void {
    this.gameLayout = new TiledLayout(
      this,
      LayoutDirection.Vertical,
      /* spacing = */ 50,
      // TODO: Why centering breaks redraws?
      /* center_elements = */ false,
      /* size = */ this.sys.canvas.width
    );
    this.gameLayout.y = 50

    this.shapeConveyor = new ShapeConveyor(this, { x: 0, y: 0 });

    this.memoryContainer = this.make.container({}, false);
    this.grid.createGrid(this.memoryContainer);

    this.gameLayout.addItem(this.memoryContainer);
    this.gameLayout.addItem(this.shapeConveyor);

    this.add.existing(this.gameLayout);

    this.createRobots();

    this.setupInputs();
  }

  setupInputs() {
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellDown(gameObject);
      }
    });

    this.input.on('gameobjectover', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellHower(gameObject, this.grid);
      }
    });

    this.input.on('gameobjectout', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellOut(gameObject);
      }
    });
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
    this.picker.memoryShapeOnConveyor = memoryShape;
  }

  update(time, delta): void {
    delta /= 1000

    for (var i = 0; i < this.robots.length; ++i) {
      let robot: Robot = this.robots[i];
      robot.update(time, delta);
    }

    this.accumulatedDelta += delta;
    while (this.accumulatedDelta > 3) {
      this.accumulatedDelta -= 3;
      if (this.shapeConveyor.shapeCount() < 10) {
        this.shapeConveyor.addNewShape(this);
      }
    }
  }
}
