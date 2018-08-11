import { CONST, GRID_CONST } from "../const/const";

export class GridCell extends Phaser.GameObjects.Sprite {
  constructor(scene, params) {
    super(scene, params.x, params.y, 'cell');

    let wScale = 0.1;
    let hScale = 0.1;

    if ("width" in params) {
      wScale = params.width / 300.0;
    }
    if ("height" in params) {
      hScale = params.height / 300.0;
    }

    this.setOrigin(0, 0);
    this.setScale(wScale, hScale);
    this.setInteractive();

    scene.add.existing(this);
  }

  setOccupied() {
    this.setAlpha(0.5);
  }
}
