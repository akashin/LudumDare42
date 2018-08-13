import { MemoryShape } from './memoryShape';
import { CONST, SCORE_CONST, PLAYER_CONST, RECYCLE_CONST } from '../const/const';
import { TiledLayout, LayoutDirection } from '../utils/layout'

function setupText(textBox: Phaser.GameObjects.Text, text: string) {
  textBox.setText(text);
  textBox.setStyle({
    fontSize: SCORE_CONST.FONT_SIZE,
    fill: SCORE_CONST.TEXT_FILL
  });
  textBox.setColor(SCORE_CONST.TEXT_COLOR);
}

class Recycler extends Phaser.GameObjects.Container {
  private recycle: Phaser.GameObjects.Sprite;
  private recycles_text: Phaser.GameObjects.Text;

  constructor(scene, params) {
    super(scene, params.x, params.y);

    this.recycle = scene.make.sprite({
      key: 'recycle',
    }, false);
    this.recycle.setOrigin(0, 0);
    this.recycle.setScale(
      60 / this.recycle.width,
      60 / this.recycle.height,
    );
    this.recycle.setInteractive();
    this.recycle.on('pointerdown', () => {
      scene.tryRecycleConveyor();
    });

    this.recycles_text = scene.make.text({
      x: 60,
      y: 40,
    }, false);
    setupText(this.recycles_text, params.recycles);

    this.add(this.recycle);
    this.add(this.recycles_text);
  }

  setRecycles(recycles) {
    this.recycles_text.setText(recycles);
  }
}

export class PlayerInfo extends Phaser.GameObjects.Container {
  private health: number;
  private _recycles: number = PLAYER_CONST.STARTING_RECYCLES;
  private healthSprites: Array<Phaser.GameObjects.Sprite>;
  private score_text: Phaser.GameObjects.Text;
  private _score: number = 0;
  private layout: TiledLayout;

  private recycler: Recycler;

  constructor(scene) {
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
    setupText(this.score_text, SCORE_CONST.TITLE + this.score);

    for (var i = 0; i < this.healthSprites.length; ++i) {
      this.layout.addItem(this.healthSprites[i]);
    }

    this.recycler = new Recycler(scene, {
      x: 0,
      y: 10,
      recycles: this.recycles,
    });


    this.layout.addItem(this.score_text);
    this.layout.addItem(this.recycler, 50);
    this.add(this.layout);
  }

  get score() {
    return this._score;
  }

  set score(newScore: number) {
    var oldScoreBucket = Math.trunc(this.score / RECYCLE_CONST.BONUS_ONE_FOR_SCORE);
    var newScoreBucket = Math.trunc(newScore / RECYCLE_CONST.BONUS_ONE_FOR_SCORE);
    this.recycles += (newScoreBucket - oldScoreBucket) > 0 ? 1 : 0;
    this.recycles = Math.min(PLAYER_CONST.MAX_RECYCLES, this.recycles);

    this._score = newScore;
    this.score_text.setText(SCORE_CONST.TITLE + this.score);
  }

  get recycles() {
    return this._recycles;
  }

  set recycles(newRecycles: number) {
    this._recycles = newRecycles;
    this.recycler.setRecycles(this.recycles);
  }

  onMemoryShapePlaced(memory_shape: MemoryShape) {
    this.score += this.calculateMemoryShapeCost(memory_shape);
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

  damage(): void {
    this.health = Math.max(0, this.health - 1);
    this.healthSprites[this.health].setAlpha(0.5);
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  tryRecycle(successCallback) {
    if (this.recycles > 0) {
      --this.recycles;
      successCallback();
    }
    else {
      console.log("Recycling not allowed!");
    }
  }
}
