import { CONST, CONVEYOR_CONST, GRID_CONST, SCORE_CONST, COLOR_CONST } from "../const/const";
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
import { ShapeType } from "../logic/shapeType";

export class MainScene extends Phaser.Scene {
  private grid: Grid;
  private lastHoverCell: GridCell;
  private lastHoverPointer;
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
  private shapePlacedMusic: Phaser.Sound.HTML5AudioSound;
  private alarmSound: Phaser.Sound.HTML5AudioSound;

  private emitters = new Array<Phaser.GameObjects.Particles.ParticleEmitter>();

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void {
    this.robots = new Array<Robot>();
    this.tasks = new Array<Task>();
    this.picker = new Picker();
    this.lastHoverCell = null;
  }

  preload(): void {
    // Load images.
    this.load.image('cell', 'assets/cell.png');
    this.load.image('positive_atom', 'assets/positive.png');
    this.load.image('negative_atom', 'assets/negative.png');
    this.load.image("engineer", "./assets/engineer.png");
    this.load.image("heart", "./assets/heart.png");
    this.load.image("wastebin", "./assets/wastebin.png");
    this.load.image("conveyor", "./assets/conveyor.png");

    // Load sounds.
    this.load.audio('shapePlaced', './assets/sounds/put.wav');
    this.load.audio('alarm', './assets/sounds/alarm.wav');
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
      scale: 0.3,
    }, false);
    this.wastebin.setInteractive();
    this.wastebin.on('pointerdown', () => {
      this.tryRecycleConveyor();
    });

    this.gameLayout.addItem(this.playerInfo);
    this.gameLayout.addItem(this.grid);
    this.gameLayout.addItem(this.shapeConveyor);
    this.gameLayout.addItem(this.deathTimerText);
    this.gameLayout.addItem(this.wastebin, 20);

    this.add.existing(this.gameLayout);

    this.createEmitters();

    this.setupInputs();

    this.shapePlacedMusic = <Phaser.Sound.HTML5AudioSound> this.sound.add('shapePlaced', {
      volume: 0.2,
    });
    this.alarmSound = <Phaser.Sound.HTML5AudioSound> this.sound.add('alarm', {
      volume: 0.2,
      loop: true,
    });
  }

  setupInputs() {
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellDown(
          pointer, gameObject, this.grid, (task: Task) => {
            this.addTask(task);
            this.shapeConveyor.deleteShape(this.picker.pickedShape);
            this.playerInfo.onMemoryShapePlaced(this.picker.pickedShape.memoryShape);
            this.shapePlacedMusic.play();
          });
      }
    });

    this.input.on('gameobjectover', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellHover(pointer, gameObject, this.grid);
        this.lastHoverCell = gameObject as GridCell;
        this.lastHoverPointer = pointer;
      }
    });

    this.input.on('gameobjectout', (pointer, gameObject) => {
      if (gameObject instanceof GridCell) {
        this.picker.onGridCellOut(gameObject);
        this.lastHoverCell = null;
        this.lastHoverPointer = null;
      }
    });
  }

  createEmitters() {
    let textures = ['positive_atom', 'negative_atom'];
    let tints = [CONVEYOR_CONST.CREATOR_SHAPE_COLOR, CONVEYOR_CONST.ERASER_SHAPE_COLOR];

    for (let i = 0; i < 2; i++) {
      let particles = this.add.particles(textures[i]);
      let params = {
        lifespan: 1000,
        speed: { min: 300, max: 400 },
        alpha: { start: 1, end: 0 },
        tint: tints[i],
        rotate: { start: 0, end: 360, ease: 'Power2' },
        blendMode: 'ADD',
        on: false
      };
      this.emitters.push(particles.createEmitter(params));
    }
  }

  getEmitter(type: ShapeType) : Phaser.GameObjects.Particles.ParticleEmitter {
    if (type == ShapeType.Creator) {
      return this.emitters[0];
    } else if (type == ShapeType.Eraser) {
      return this.emitters[1];
    } else {
      alert("Wrong shape type!");
      return null;
    }
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
        //this.alarmSound.play();
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

    let finishedTasks = new Array<number>();
    for (var i = 0; i < this.tasks.length; ++i) {
      let task: Task = this.tasks[i];

      task.update();
      task.updateGrid(this.grid);
      if (task.isFinished()) {
        finishedTasks.push(i);
      }
    }

    for (var i = finishedTasks.length - 1; i >= 0; --i) {
      this.tasks.splice(finishedTasks[i], 1);
    }

    this.updateGameSpeed();

    if (this.lastHoverCell != null) {
      this.picker.onGridCellHover(this.lastHoverPointer, this.lastHoverCell, this.grid);
    }
  }

  loseLife() {
    console.log("Life is lost!");
    this.timeTicker = 0;
    this.shapeConveyor.clear();
    this.picker.clear();
    this.playerInfo.damage();
    this.alarmSound.stop();
  }

  tryRecycleConveyor() {
    this.playerInfo.tryRecycle(() => {
      this.timeTicker = 0;
      this.shapeConveyor.clear();
      this.picker.clear();
      this.alarmSound.stop();

      // TODO: test v2 as well. whe we delete only picked cell.
      //this.timeTicker = 0;
      //this.shapeConveyor.deleteShape(this.picker.pickedShape);
      //this.picker.clear();
    });
  }

  addTask(task: Task): void {
    this.tasks.push(task);
  }
}
