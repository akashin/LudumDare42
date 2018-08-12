import { MemoryShape } from './memoryShape';
import { CONST, SCORE_CONST } from '../const/const';

export class ScoreManager extends Phaser.GameObjects.Container {
  private score_text: Phaser.GameObjects.Text;
  private _score: number = 0;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.score_text = scene.make.text({}, false);
    this.score_text.setPosition(
      SCORE_CONST.B_BOX_W_START,
      SCORE_CONST.B_BOX_H_START
    );
    this.score_text.setText(
      SCORE_CONST.TITLE + this.score
    );
    this.score_text.setStyle({
      fontSize: SCORE_CONST.FONT_SIZE,
      fill: SCORE_CONST.TEXT_FILL
    });
    this.score_text.setColor(SCORE_CONST.TEXT_COLOR);

    this.add(this.score_text);
  }

  get score() {
    return this._score;
  }

  onMemoryShapePlaced(memory_shape: MemoryShape) {
    this._score += this.calculateMemoryShapeCost(memory_shape);
    this.score_text.setText(SCORE_CONST.TITLE + this.score);
  }

  calculateMemoryShapeCost(memory_shape: MemoryShape): number {
    var cost = 0;
    for (var row = 0; row < memory_shape.getHeight(); ++row) {
      for (var column = 0; column < memory_shape.getWidth(); ++column) {
        if (memory_shape.hasCell(row, column)) {
          cost += SCORE_CONST.GRID_CELL_VALUE;
        }
      }
    }
    return cost;
  }
}
