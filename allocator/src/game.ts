/// <reference path="../phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";
import { TitleScene } from "./scenes/titleScene";
import { CONST } from './const/const';

// main game configuration
const config: GameConfig = {
  width: CONST.GAME_WIDTH,
  height: CONST.GAME_HEIGHT,
  type: Phaser.AUTO,
  parent: "game",
  // TODO change order here to disable menu screen.
  scene: [TitleScene, MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
