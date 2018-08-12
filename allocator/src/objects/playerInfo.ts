import { MemoryShape } from './memoryShape';
import { CONST, SCORE_CONST, PLAYER_CONST } from '../const/const';
import { TiledLayout, LayoutDirection } from '../utils/layout'

export class PlayerInfo extends Phaser.GameObjects.Container {
  private health: number;
  private healthSprites: Array<Phaser.GameObjects.Sprite>;
  private score_text: Phaser.GameObjects.Text;
  private _score: number = 0;
  private layout: TiledLayout;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.layout = new TiledLayout(scene, LayoutDirection.Horizontal, 0);

    this.health = PLAYER_CONST.STARTING_HEALTH;
    this.healthSprites = Array<Phaser.GameObjects.Sprite>();

    for (var i = 0; i < this.health; ++i) {
      let sprite = scene.make.sprite({}, false);
      sprite.setTexture("heart");
      sprite.setScale(64 / sprite.width, 64 / sprite.height);
      sprite.setOrigin(0, 0);
      this.healthSprites.push(sprite);
    }

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

    for (var i = 0; i < this.healthSprites.length; ++i) {
      this.layout.addItem(this.healthSprites[i]);
    }
    this.layout.addItem(this.score_text);

    this.add(this.layout);
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

  damage() {
    this.health = Math.max(0, this.health - 1);
    this.healthSprites[this.health].setAlpha(0.5);
  }
}
