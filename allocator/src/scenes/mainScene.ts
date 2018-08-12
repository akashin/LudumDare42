import { CONST, CONVEYOR_CONST } from "../const/const";
import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { MemoryShapeOnConveyor } from "../objects/memoryShapeOnConveyor";
import { Robot, RobotType } from "../objects/robot";
import { Task } from "../logic/task";
import { TiledLayout, LayoutDirection } from "../utils/layout";
import { Grid } from "../objects/grid";
import { Picker } from '../utils/picker';
import { ScoreManager } from '../objects/scoreManager';

export class MainScene extends Phaser.Scene {
  private grid: Grid;
  private robots: Array<Robot>;
  private shapeConveyor: ShapeConveyor;
  private gameLayout: TiledLayout;
  private picker: Picker;
  private scoreManager: ScoreManager;

  private accumulatedDelta: number = 0;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
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
        var shape_placed = this.picker.onGridCellDown(gameObject);
        if (shape_placed) {
          this.shapeConveyor.deleteShape(this.picker.memoryShapeOnConveyor);
          this.scoreManager.onMemoryShapePlaced(this.picker.memoryShapeOnConveyor.getMemoryShape());
          this.picker.memoryShapeOnConveyor = null;
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
    let robot = new Robot(this, 0, 0, RobotType.Engineer);
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

    this.grid.addObject(robot);
  }

  setChosenMemoryShape(memoryShape: MemoryShapeOnConveyor) {
    this.picker.memoryShapeOnConveyor = memoryShape;
  }

  update(time, delta): void {
    delta /= 1000;

    for (var i = 0; i < this.robots.length; ++i) {
      this.robots[i].update();
    }

    this.accumulatedDelta += delta;
    while (this.accumulatedDelta > CONVEYOR_CONST.SHAPE_GEN_PERIOD) {
      this.accumulatedDelta -= CONVEYOR_CONST.SHAPE_GEN_PERIOD;
      if (this.shapeConveyor.shapeCount() < CONVEYOR_CONST.SHAPE_CAPACITY) {
        this.shapeConveyor.addNewShape(this);
      } else {
        // TODO: Show end game screen.
      }
    }
  }
}
