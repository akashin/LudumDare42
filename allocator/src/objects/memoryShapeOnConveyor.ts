import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { MemoryCell } from "./memoryCell";
import { ShapeType } from "../logic/shapeType";

export class MemoryShapeOnConveyor extends Phaser.GameObjects.Container {
  private _memoryShape: MemoryShape;
  private isChosen: boolean = false;
  private _shapeType: ShapeType;

  constructor(scene, shape, shapeType, params) {
    super(scene, params.x, params.y);

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

    this.on('pointerover', function() {
      if (!this.isChosen) {
        this.setAlpha(0.7);
      }
    });
    this.on('pointerout', function() {
      if (!this.isChosen) {
        this.setAlpha(1.0);
      }
    });

    this.on('pointerdown', function() {
      if (this.isChosen) {
        this.setChosen(false);
        scene.setChosenMemoryShape(null);
      } else {
        this.setChosen(true);
        scene.setChosenMemoryShape(this);
      }
    });
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
}
