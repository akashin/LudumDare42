import { CONST, CONVEYOR_CONST, GRID_CONST, SCORE_CONST } from "../const/const";
import { GridCell } from "../objects/gridCell";
import { ShapeConveyor } from "../objects/shapeConveyor";
import { MemoryShapeOnConveyor } from "../objects/memoryShapeOnConveyor";
import { ShapeGenerator } from "../logic/shapeGenerator";
import { Robot, RobotType } from "../objects/robot";
import { Task, TaskType } from "../logic/task";
import { TiledLayout, LayoutDirection } from "../utils/layout";
import { Grid } from "../objects/grid";
import { Picker } from '../utils/picker';
import { PlayerInfo } from '../objects/playerInfo';
import { MemoryShape } from "../objects/memoryShape";

export class MainScene extends Phaser.Scene {
  private grid: Grid;
  private robots: Array<Robot>;
  private tasks: Array<Task>;
  private shapeConveyor: ShapeConveyor;
  private gameLayout: TiledLayout;
  private picker: Picker;
  private playerInfo: PlayerInfo;
  private deathTimerText: Phaser.GameObjects.Text;
  private shapeGenerator: ShapeGenerator;
  private gameSpeed: number = CONST.BASE_GAME_SPEED;
  private timeTicker: number = 0;
  private health: number;
  private wastebin: Phaser.GameObjects.Sprite;
  private deathTimer: number = null;

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
    this.load.image('positive_atom', 'assets/positive.png');
    this.load.image('negative_atom', 'assets/negative.png');
    this.load.image("engineer", "./assets/engineer.png");
    this.load.image("heart", "./assets/heart.png");
    this.load.image("wastebin", "./assets/wastebin.png");
    this.load.image("conveyor", "./assets/conveyor.png");
  }

  create(): void {
    this.gameLayout = new TiledLayout(
      this,
      LayoutDirection.Vertical,
      /* spacing = */ 25,
      // TODO: Why centering breaks redraws?
      /* center_elements = */ false,
      /* size = */ this.sys.canvas.width
    );

    this.shapeGenerator = new ShapeGenerator();
    this.shapeConveyor = new ShapeConveyor(this, {
      x: 0,
      y: 0,
      shapeGenerator: this.shapeGenerator,
    });
    this.playerInfo = new PlayerInfo(this);
    this.grid = new Grid(this);

    this.deathTimerText = this.make.text({}, false);
    this.deathTimerText.setText("");

    this.wastebin = this.make.sprite({
      // TODO: Why do we need this constant?
      x: 100,
      key: 'wastebin',
      scale: 0.5,
    }, false);
    this.wastebin.setInteractive();
    this.wastebin.on('pointerdown', () => {
      this.tryRecycleConveyor();
    });

    this.gameLayout.addItem(this.playerInfo);
    this.gameLayout.addItem(this.grid);
    this.gameLayout.addItem(this.shapeConveyor);
    this.gameLayout.addItem(this.deathTimerText);
    this.gameLayout.addItem(this.wastebin, 150);

    this.add.existing(this.gameLayout);

    this.createRobots();

    this.setupInputs();
  }

  setupInputs() {
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellDown(
          gameObject, (task: Task) => {
            this.addTask(task);
            this.shapeConveyor.deleteShape(this.picker.pickedShape);
            this.playerInfo.onMemoryShapePlaced(this.picker.pickedShape.memoryShape);  
          });
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

  updateGameSpeed(): void {
    let speedMultiplier = SCORE_CONST.GAME_SPEED_PER_SCORE_CHANGE * this.playerInfo.score;
    this.gameSpeed = CONST.BASE_GAME_SPEED / (1 + speedMultiplier);
  }

  update(time: number, delta: number): void {
    this.timeTicker += delta;
    while (this.timeTicker > this.gameSpeed) {
      this.updateStep();
      this.timeTicker -= this.gameSpeed;
    }
  }

  updateStep(): void {
    this.shapeConveyor.update();
    if (this.shapeConveyor.isFull()) {
      if (this.deathTimer == null) {
        this.deathTimer = CONVEYOR_CONST.DEATH_TIMER_TICKS;
      }
      this.deathTimer = Math.max(0, this.deathTimer - 1);
      this.deathTimerText.setText(this.deathTimer.toString());
      if (this.deathTimer == 0) {
        this.loseLife();
      }
    } else {
      this.deathTimer = null;
      this.deathTimerText.setText("");
    }

    if (this.tasks.length > 0) {
      let task: Task = this.tasks[0];

      task.update();
      task.updateGrid(this.grid);
      if (task.isFinished()) {
        this.tasks.splice(0, 1);
      }
    }

    this.updateGameSpeed();
  }

  loseLife() {
    console.log("Life is lost!");
    this.timeTicker = 0;
    this.shapeConveyor.clear();
    this.picker.clear();
    this.playerInfo.damage();
  }

  tryRecycleConveyor() {
    this.timeTicker = 0;
    this.shapeConveyor.clear();
    this.picker.clear();

    // TODO: test v2 as well. whe we delete only picked cell.
    //this.timeTicker = 0;
    //this.shapeConveyor.deleteShape(this.picker.pickedShape);
    //this.picker.clear();
  }

  addTask(task: Task): void {
    this.tasks.push(task);
  }
}
