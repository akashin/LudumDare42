import { CONST, CONVEYOR_CONST, GRID_CONST } from "../const/const";
import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { MemoryShapeOnConveyor } from "../objects/memoryShapeOnConveyor";
import { ShapeGenerator } from "../logic/shapeGenerator";
import { Robot, RobotType } from "../objects/robot";
import { Task, TaskType } from "../logic/task";
import { TiledLayout, LayoutDirection } from "../utils/layout";
import { Grid } from "../objects/grid";
import { Picker } from '../utils/picker';
import { ScoreManager } from '../objects/scoreManager';
import { MemoryShape } from "../objects/memoryShape";

export class MainScene extends Phaser.Scene {
  private grid: Grid;
  private robots: Array<Robot>;
  private tasks: Array<Task>;
  private shapeConveyor: ShapeConveyor;
  private gameLayout: TiledLayout;
  private picker: Picker;
  private scoreManager: ScoreManager;
  private shapeGenerator: ShapeGenerator;

  private accumulatedDelta: number = 0;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.robots = new Array<Robot>();
    this.tasks = new Array<Task>();
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

    this.shapeGenerator = new ShapeGenerator();
    this.shapeConveyor = new ShapeConveyor(this, {
      x: 0,
      y: 0,
      shapeGenerator: this.shapeGenerator,
    });
    this.scoreManager = new ScoreManager(this);
    this.grid = new Grid(this);

    this.gameLayout.addItem(this.grid);
    this.gameLayout.addItem(this.shapeConveyor);

    this.add.existing(this.gameLayout);

    this.createRobots();

    this.setupInputs();
  }

  setupInputs() {
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        let isShapePlaced = this.picker.onGridCellDown(gameObject);
        if (isShapePlaced) {
          this.shapeConveyor.deleteShape(this.picker.pickedShape);
          this.scoreManager.onMemoryShapePlaced(this.picker.pickedShape.getMemoryShape());
          this.picker.pickedShape = null;
        }
      }
    });

    this.input.on('gameobjectover', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellHover(gameObject, this.grid);
      }
    });

    this.input.on('gameobjectout', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellOut(gameObject);
      }
    });
  }

  createRobots() {
    let mask = new Array<Array<boolean>>();
    for (var x = 0; x < 3; ++x) {
      let column = Array<boolean>();
      for (var y = 0; y < 3; ++y) {
        column.push((x + y) % 2 == 0);
      }
      mask.push(column);
    }

    let task1 = new Task(TaskType.ALLOCATE, 1, 1, mask);
    let task2 = new Task(TaskType.ALLOCATE, 1, 5, mask);
    this.addTask(task1);
    this.addTask(task2);
  }

  setChosenMemoryShape(memoryShape: MemoryShapeOnConveyor) {
    this.picker.pickedShape = memoryShape;
  }

  update(): void {
    this.shapeConveyor.update();
    if (this.shapeConveyor.isFull()) {
      // TODO: Show end game screen.
    }

    if (this.tasks.length > 0) {
      let task: Task = this.tasks[0];

      task.update();
      task.updateGrid(this.grid);
      if (task.isFinished()) {
        this.tasks.splice(0, 1);
      }
    }
  }

  addTask(task: Task): void {
    this.tasks.push(task);
  }
}
