import { CONST, GRID_CONST } from "../const/const";

export class GridCell extends Phaser.GameObjects.Sprite {
  constructor(scene, params) {
    super(scene, params.x, params.y, 'cell');

    this.setOrigin(0, 0);
    this.setScale(0.1, 0.1);
    this.setInteractive();

    scene.add.existing(this);
  }

  setOccupied() {
    this.setAlpha(0.5);
  }
}
