import { MemoryShape } from './memoryShape';
import { CONST, SCORE_CONST, PLAYER_CONST, RECYCLE_CONST } from '../const/const';
import { TiledLayout, LayoutDirection } from '../utils/layout'

export class PlayerInfo extends Phaser.GameObjects.Container {
  private health: number;
  private recycles: number;
  private healthSprites: Array<Phaser.GameObjects.Sprite>;
  private score_text: Phaser.GameObjects.Text;
  private _score: number = 0;
  private recycles_text: Phaser.GameObjects.Text;
  private layout: TiledLayout;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.layout = new TiledLayout(scene, LayoutDirection.Horizontal, 0);

    this.health = PLAYER_CONST.STARTING_HEALTH;
    this.recycles = PLAYER_CONST.RECYCLES;

    this.healthSprites = Array<Phaser.GameObjects.Sprite>();

    for (var i = 0; i < this.health; ++i) {
      let sprite = scene.make.sprite({}, false);
      sprite.setTexture("heart");
      sprite.setScale(64 / sprite.width, 64 / sprite.height);
      sprite.setOrigin(0, 0);
      this.healthSprites.push(sprite);
    }

    this.score_text = scene.make.text({}, false);
    this.createText(this.score_text, SCORE_CONST.TITLE + this.score);
    this.score_text.setPosition(
      SCORE_CONST.B_BOX_W_START,
      SCORE_CONST.B_BOX_H_START
    );

    this.recycles_text = scene.make.text({}, false);
    this.createText(this.recycles_text, RECYCLE_CONST.TITLE + this.recycles);
    this.recycles_text.setPosition(
      RECYCLE_CONST.B_BOX_W_START,
      RECYCLE_CONST.B_BOX_H_START
    );

    for (var i = 0; i < this.healthSprites.length; ++i) {
      this.layout.addItem(this.healthSprites[i]);
    }
    this.layout.addItem(this.score_text);
    this.layout.addItem(this.recycles_text);
    this.add(this.layout);
  }

  private createText(textBox: Phaser.GameObjects.Text, text: string) {
    this.score_text.setText(text);
    this.score_text.setStyle({
      fontSize: SCORE_CONST.FONT_SIZE,
      fill: SCORE_CONST.TEXT_FILL
    });
    this.score_text.setColor(SCORE_CONST.TEXT_COLOR);
  }

  get score() {
    return this._score;
  }

  set score(newScore: number) {
    var oldScoreBucket = Math.trunc(this.score / RECYCLE_CONST.BONUS_ONE_FOR_SCORE);
    var newScoreBucket = Math.trunc(newScore / RECYCLE_CONST.BONUS_ONE_FOR_SCORE);
    this._score = newScore;
    this.recycles += (newScoreBucket - oldScoreBucket) > 0 ? 1 : 0;
  }

  onMemoryShapePlaced(memory_shape: MemoryShape) {
    this.score += this.calculateMemoryShapeCost(memory_shape);
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
    this.recycles += PLAYER_CONST.RECYCLES;
    this.healthSprites[this.health].setAlpha(0.5);
  }

  isRecyclingAllowed(): boolean {
    return this.recycles > 0;
  }
}
