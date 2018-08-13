import { CONST, CONVEYOR_CONST, COLOR_CONST } from '../const/const';
import { MemoryShape } from "./memoryShape";
import { MemoryCell } from "./memoryCell";
import { ShapeType } from "../logic/shapeType";
import { MainScene } from '../scenes/mainScene';

export class MemoryShapeOnConveyor extends Phaser.GameObjects.Container {
  private _memoryShape: MemoryShape;
  private isChosen: boolean = false;
  private _shapeType: ShapeType;
  private isChosenEmphasis: Phaser.GameObjects.Graphics;

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
    
    var graphics = (scene as MainScene).add.graphics();
    graphics.lineStyle(5, COLOR_CONST.CHOSEN_SHAPE_EMPHASIS);
    this.isChosenEmphasis = graphics.lineBetween(
      0, this.getBounds().height, this.getBounds().width, this.getBounds().height);
    this.isChosenEmphasis.setAlpha(0.0);
    this.add(this.isChosenEmphasis);

    this.startInputEvents();
  }

  moveAnimated(x: number) {
    let moveDelay = 500;
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
      this.isChosenEmphasis.setAlpha(1.0);
    } else {
      this.isChosenEmphasis.setAlpha(0.0);
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
    this.isChosenEmphasis.setAlpha(0.0);
    for (let childIt of this.list) {
      if (childIt == this.isChosenEmphasis) {
        // TODO: some dirty hack, boundingBox in the container negatively affects animation.
        // consider deleting boundingBox from the container.
        continue;
      }
      let child = childIt as any;
      let [x, y] = this.getXYwrtScene(child);
      let emitter = (this.scene as any).getEmitter(this._shapeType);
      emitter.setScale({start: child.scaleX * 0.75, end: 0});
      emitter.explode(6, x, y);
    }
  }
}
