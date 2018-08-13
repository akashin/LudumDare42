import { CONST, CONVEYOR_CONST, COLOR_CONST } from '../const/const';
import { MemoryShape } from "./memoryShape";
import { MemoryCell } from "./memoryCell";
import { ShapeType } from "../logic/shapeType";
import { MainScene } from '../scenes/mainScene';

export class MemoryShapeOnConveyor extends Phaser.GameObjects.Container {
  private _memoryShape: MemoryShape;
  private isChosen: boolean = false;
  private _shapeType: ShapeType;
  private isChosenSprite: Phaser.GameObjects.Sprite;

  constructor(scene, shape, shapeType, params) {
    super(scene, CONST.GAME_WIDTH, params.y);

    this._memoryShape = shape;
    this._shapeType = shapeType;

    // Debug graphics.
    //let g = scene.make.graphics({
    //}).fillStyle(0xFFFF00, 1.0)
      //.fillRect(0, 0, 30 * 3, 30 * 3);
    //this.add(g);

    this.isChosenSprite = scene.make.sprite({
      key: 'blank'
    });
    this.isChosenSprite.setOrigin(0, 0);
    this.isChosenSprite.setScale(
      CONVEYOR_CONST.SHAPE_CELL_WIDTH * 3 / this.isChosenSprite.width,
      CONVEYOR_CONST.SHAPE_CELL_HEIGHT * 3 / this.isChosenSprite.height,
    );
    this.isChosenSprite.alpha = 0.0;
    this.isChosenSprite.setTint(0xFFFF00);
    //this.isChosenSprite.visible = false;
    this.add(this.isChosenSprite);
    //console.log(this.isChosenSprite.getBounds());
    //console.log(this.isChosenSprite.displayHeight, this.isChosenSprite.displayWidth);

    let dx = (CONVEYOR_CONST.MEMORY_SHAPE_COLUMNS - this.memoryShape.getWidth()) * CONVEYOR_CONST.SHAPE_CELL_WIDTH / 2;
    let dy = (CONVEYOR_CONST.MEMORY_SHAPE_ROWS - this.memoryShape.getHeight()) * CONVEYOR_CONST.SHAPE_CELL_HEIGHT / 2;

    for (var row = 0; row < this.memoryShape.getHeight(); ++row) {
      for (var column = 0; column < this.memoryShape.getWidth(); ++column) {
        if (this.memoryShape.hasCell(row, column)) {
          let cell = new MemoryCell(scene, {
            x: column * CONVEYOR_CONST.SHAPE_CELL_WIDTH + dx,
            y: row * CONVEYOR_CONST.SHAPE_CELL_HEIGHT + dy,
            shapeType: this.shapeType,
          });
          this.add(cell);
        }
      }
    }

    this.setInteractive(new Phaser.Geom.Rectangle(
      0, params.y, this.getBounds().width, this.getBounds().height), Phaser.Geom.Rectangle.Contains);

    this.moveAnimated(params.x);

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
      this.isChosenSprite.setAlpha(0.3);
    }
  }

  onPointerOut() {
    if (!this.isChosen) {
      this.isChosenSprite.setAlpha(0.0);
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
      this.isChosenSprite.setAlpha(0.5);
    } else {
      this.isChosenSprite.setAlpha(0.0);
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
    this.isChosenSprite.setAlpha(0.0);
    for (let childIt of this.list) {
      if (childIt == this.isChosenSprite) {
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
