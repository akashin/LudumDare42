import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { MemoryCell } from "./memoryCell";
import { ShapeType } from "../logic/shapeType";

export class MemoryShapeOnConveyor extends Phaser.GameObjects.Container {
  private _memoryShape: MemoryShape;
  private isChosen: boolean = false;
  private _shapeType: ShapeType;

  constructor(scene, shape, shapeType, params) {
    super(scene, CONST.GAME_WIDTH, params.y);

    this._memoryShape = shape;
    this._shapeType = shapeType;

    for (var row = 0; row < this.memoryShape.getHeight(); ++row) {
      for (var column = 0; column < this.memoryShape.getWidth(); ++column) {
        if (this.memoryShape.hasCell(row, column)) {
          let cell = new MemoryCell(scene, {
            x: column * CONVEYOR_CONST.SHAPE_CELL_WIDTH,
            y: row * CONVEYOR_CONST.SHAPE_CELL_HEIGHT,
            shapeType: this.shapeType,
          });
          this.add(cell);
        }
      }
    }
    this.setInteractive(new Phaser.Geom.Rectangle(
      0, 0, this.getBounds().width, this.getBounds().height), Phaser.Geom.Rectangle.Contains);

    this.moveAnimated(params.x);

    this.startInputEvents();
  }

  moveAnimated(x: number) {
    let moveDelay = 5000;
    this.scene.tweens.add({
      targets: [ this ],
      x: x,
      ease: 'Sine.easeInOut',
      duration: moveDelay
    });
  }

  onPointerOver() {
    if (!this.isChosen) {
      this.setAlpha(0.7);
    }
  }

  onPointerOut() {
    if (!this.isChosen) {
      this.setAlpha(1.0);
    }
  }

  onPointerDown() {
    if (this.isChosen) {
      this.setChosen(false);
      (this.scene as any).setChosenMemoryShape(null);
    } else {
      this.setChosen(true);
      (this.scene as any).setChosenMemoryShape(this);
    }
  }

  startInputEvents() {
    this.on('pointerover', this.onPointerOver, this);
    this.on('pointerout', this.onPointerOut, this);
    this.on('pointerdown', this.onPointerDown, this);
  }

  stopInputEvents() {
    this.off('pointerover', this.onPointerOver, null, false);
    this.off('pointerout', this.onPointerOut, null, false);
    this.off('pointerdown', this.onPointerDown, null, false);
  }

  get memoryShape() : MemoryShape {
    return this._memoryShape;
  }

  get shapeType() {
    return this._shapeType;
  }

  setChosen(isChosen: boolean) {
    this.isChosen = isChosen;
    if (isChosen) {
      this.setAlpha(0.5);
    } else {
      this.setAlpha(1.0);
    }
  }

  getXYwrtScene(object: any) : [number, number] {
    let x = 0;
    let y = 0;
    while (object != null) {
      x += object.x;
      y += object.y;
      object = object.parentContainer;
    }
    return [x, y];
  }

  // Not to be confused with getRect
  getRekt() {
    for (let childIt of this.list) {
      let child = childIt as any;
      let [x, y] = this.getXYwrtScene(child);
      let emitter = (this.scene as any).getEmitter(this._shapeType);
      emitter.setScale({start: child.scaleX * 0.75, end: 0});
      emitter.explode(6, x, y);
    }
  }
}
