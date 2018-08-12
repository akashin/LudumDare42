import { MemoryShape } from './memoryShape';
import { CONST, SCORE_CONST } from '../const/const';

export class ScoreManager {
    private score_text: Phaser.GameObjects.Text;
    private score: number = 0;

    constructor(scene: Phaser.Scene) {
        this.score_text = scene.add.text( 
            SCORE_CONST.B_BOX_W_START,
            SCORE_CONST.B_BOX_H_START,
            SCORE_CONST.TITLE + this.score, 
            { fontSize: SCORE_CONST.FONT_SIZE,
                fill: SCORE_CONST.TEXT_FILL });
        this.score_text.setColor(SCORE_CONST.TEXT_COLOR);
    }

    onMemoryShapePlaced(memory_shape: MemoryShape) {
        this.score += this.calculateMemoryShapeCost(memory_shape);
        this.score_text.setText(SCORE_CONST.TITLE + this.score);
    }

    calculateMemoryShapeCost(memory_shape: MemoryShape): number {
        var cost = 0;
        for (var w = 0; w < memory_shape.getWidth(); ++w) {
            for (var h = 0; h < memory_shape.getHeight(); ++h) {
                if (memory_shape.hasCell(w, h)) {
                    cost += SCORE_CONST.GRID_CELL_VALUE;
                }
            }
        }
        
        return cost;
    }
}