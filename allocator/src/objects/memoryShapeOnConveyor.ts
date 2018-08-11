import { CONST, CONVEYOR_CONST } from "../const/const";
import { MemoryShape } from "./memoryShape";
import { GridCell } from "./gridCell";

export class MemoryShapeOnConveyor extends Phaser.GameObjects.Container {
  private memoryShape: MemoryShape;

  constructor(scene, shape, params) {
    super(scene, params.x, params.y);

    this.memoryShape = shape;

    for (var w = 0; w < this.memoryShape.getWidth(); ++w) {
      for (var h = 0; h < this.memoryShape.getHeight(); ++h) {
        if (this.memoryShape.hasCell(w, h)) {
          // TODO: Use a separate grid cell type.
          let cell = new GridCell(scene, {
            x: w * CONVEYOR_CONST.SHAPE_CELL_WIDTH,
            y: h * CONVEYOR_CONST.SHAPE_CELL_HEIGHT,
            width: CONVEYOR_CONST.SHAPE_CELL_WIDTH,
            height: CONVEYOR_CONST.SHAPE_CELL_HEIGHT,
          });
          this.add(cell);
        }
      }
    }
    this.setInteractive(new Phaser.Geom.Rectangle(
      0, 0, this.getBounds().width, this.getBounds().height), Phaser.Geom.Rectangle.Contains);

    this.on('pointerover', function() {
      this.setAlpha(0.7);
    });
    this.on('pointerout', function() {
      this.setAlpha(1.0);
    });

    this.on('pointerdown', this.setChosen);

    scene.add.existing(this);
  }

  setChosen() {
    console.log("Shape on conveyor clicked");
    this.setAlpha(0.5);
  }
}
