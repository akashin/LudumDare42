import { CONST, CONVEYOR_CONST } from "../const/const";
import { ShapeGenerator } from "../logic/shapeGenerator";
import { MemoryShapeOnConveyor } from "./memoryShapeOnConveyor";
import { TiledLayout, LayoutDirection } from "../utils/layout";
import { MainScene } from '../scenes/mainScene';

export class ShapeConveyor extends Phaser.GameObjects.Container {
  private shapes: Array<MemoryShapeOnConveyor>;
  private shapeGenerator: ShapeGenerator;
  private layout: TiledLayout;
  private conveyor: Phaser.GameObjects.Sprite;
  private generationCounter: number;
  private elementsShortcuts: Array<Phaser.Input.Keyboard.Key>;

  constructor(scene, params) {
    super(scene, params.x, params.y);
    this.bindKeyboard(scene);

    this.initBegin();
    this.shapeGenerator = params.shapeGenerator;

    this.layout = new TiledLayout(scene, LayoutDirection.Horizontal, CONVEYOR_CONST.SPACING);

    let slot_size = CONVEYOR_CONST.SHAPE_CELL_WIDTH * 3 + 40;
    this.conveyor = scene.make.tileSprite({
      width: CONVEYOR_CONST.TILE_SIZE,
      height: CONVEYOR_CONST.TILE_SIZE * CONVEYOR_CONST.SHAPE_CAPACITY,
      key: 'conveyor',
      add: false
    });
    this.conveyor.setOrigin(0, 0);
    this.conveyor.setScale(
      slot_size / this.conveyor.width,
      slot_size / this.conveyor.width,
    )
    this.add(this.conveyor);

    this.add(this.layout);

    this.createShapes(scene);
  }

  private initBegin() {
    this.shapes = new Array<MemoryShapeOnConveyor>();
    this.generationCounter = CONVEYOR_CONST.SHAPE_GEN_PERIOD;
  }

  createShapes(scene): void {
    for (var i = 0; i < CONVEYOR_CONST.SHAPE_COUNT; ++i) {
      this.addNewShape(scene);
    }
  }

  shapeCount(): number {
    return this.shapes.length;
  }

  isFull(): boolean {
    return this.shapes.length == CONVEYOR_CONST.SHAPE_CAPACITY;
  }

  getShapeY(index: number) {
    let spacing = CONVEYOR_CONST.SPACING;
    //let y = this.conveyor.displayHeight - CONVEYOR_CONST.SHAPE_CELL_HEIGHT * 3.5;
    // TODO: This should depend on
    //let y = this.conveyor.displayHeight / 8;
    let y = 20;

    for (let i = 0; i < index; i++) {
      y += this.shapes[i].getBounds().height;
      y += spacing;
    }

    return y;
  }

  addNewShape(scene): void {
    console.log("Adding shape");
    let [shape, shapeType] = this.shapeGenerator.generateShape();
    let shapeOnConveyor = new MemoryShapeOnConveyor(scene, shape, shapeType, {
      // TODO: Tweak this.
      x: this.conveyor.displayWidth / 2 - CONVEYOR_CONST.SHAPE_CELL_WIDTH * 1.5,
      y: this.getShapeY(this.shapes.length),
    });
    this.shapes.push(shapeOnConveyor);
    this.add(shapeOnConveyor);
  }

  deleteShape(shapeOnConveyor: MemoryShapeOnConveyor) {
    console.log("Deleting shape");
    // TODO: There is probably a method on the container.
    this.shapes = this.shapes.filter(shape => shape !== shapeOnConveyor);
    shapeOnConveyor.getRekt();
    this.remove(shapeOnConveyor);

    for (let i = 0; i < this.shapes.length; i++) {
      let targetY = this.getShapeY(i);
      if (this.shapes[i].y != targetY) {
        this.shapes[i].moveAnimated(targetY);
      }
    }

    this.generationCounter += CONVEYOR_CONST.SHAPE_GEN_ACTION_DELAY;
  }

  update() {
    this.listenToKeyboard();
    --this.generationCounter;
    if (this.generationCounter == 0) {
      if (this.shapeCount() < CONVEYOR_CONST.SHAPE_CAPACITY) {
        this.addNewShape(this.scene);
      } else {
        console.log("Conveyor is full.");
      }
      this.generationCounter = CONVEYOR_CONST.SHAPE_GEN_PERIOD;
    }
  }

  listenToKeyboard() {
    this.elementsShortcuts.forEach((item, index) => {
      if (item.isDown && 
        this.shapes.length > index) {
          // TODO at the moment, this event is called on each update
          // when the keyboard button is pressed.
          // This causes lots of issues.
          this.shapes[index].onPointerDown();
      }
    });
  }

  clear() {
    this.shapes.map((shape) => {
      shape.getRekt();
      this.remove(shape);
    });
    this.initBegin();
  }

  private bindKeyboard(scene: MainScene) {
    this.elementsShortcuts = new Array<Phaser.Input.Keyboard.Key>(6);

    this.elementsShortcuts[0] = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ONE
    );
    this.elementsShortcuts[1] = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.TWO
    );
    this.elementsShortcuts[2] = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.THREE
    );
    this.elementsShortcuts[3] = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.FOUR
    );
    this.elementsShortcuts[4] = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.FIVE
    );
    this.elementsShortcuts[5] = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SIX
    );
  }
}
