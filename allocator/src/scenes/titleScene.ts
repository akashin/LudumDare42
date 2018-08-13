import { SCORE_CONST, CONST } from '../const/const';
import { PlayerInfo } from '../objects/playerInfo';
import { HighScoresManager } from '../utils/highScoresManager';
export class TitleScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private startKey: Phaser.Input.Keyboard.Key;
  private highScoresManager: HighScoresManager;

  private optionCount = 0;
  private savedData: PlayerInfo;

  constructor() {
    super({
      key: CONST.TITLE_SCENE
    });
  }

  init(data): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    if (this.savedData instanceof PlayerInfo) {
      console.log("HERE");
    }
    this.savedData = <PlayerInfo> data;

    this.optionCount = 1;
  }

  preload(): void {
    this.load.image("menuBackground", "./assets/menu.png");
    this.load.image("start_button", "./assets/start_button.png");
    this.load.image("options_button", "./assets/options_button.png");
    this.load.image("credits_button", "./assets/credits_button.png");
  }

  create(): void {
    this.phaserSprite = this.add.sprite(0, 0, "menuBackground");
    this.phaserSprite.setOrigin(0, 0);
    let ratio = this.phaserSprite.width / this.phaserSprite.height;
    this.phaserSprite.setScale(
      CONST.GAME_HEIGHT / this.phaserSprite.height,
      CONST.GAME_HEIGHT / this.phaserSprite.height,
    );

    this.highScoresManager = new HighScoresManager(this, {
      x: 500,
      y: 50,
    });
    if (this.savedData instanceof PlayerInfo) {
      this.highScoresManager.addEntry("you", (this.savedData as PlayerInfo).score);
      this.highScoresManager.writeToLocalStorage();
    }
    this.highScoresManager.createView();
    this.add.existing(this.highScoresManager);

    this.addMenuOption('start_button', () => {
      console.log('You clicked Start!');
      this.scene.start(CONST.MAIN_SCENE);
    });

    this.addMenuOption('options_button', () => {
      console.log('You clicked Options!');
    });

    this.addMenuOption('credits_button', () => {
      console.log('You clicked Credits!');
    });
  }

  update(): void {
    if (this.startKey.isDown) {
      console.log("Space pressed");
      this.scene.start(CONST.MAIN_SCENE);
    }
  }

  addMenuOption(name: string, callback) {
    var sprite = this.add.sprite(30, (this.optionCount * 80) + 200, name);
    sprite.setInteractive();

    sprite.setFrame(1);
    sprite.setOrigin(0, 0);
    sprite.setScale(2, 2);

    sprite.on('pointerover', function (target) {
      sprite.setFrame(2);
    });

    sprite.on('pointerout', function (target) {
      sprite.setFrame(1);
    });

    sprite.on('pointerup', callback);

    ++this.optionCount;
  }
}
