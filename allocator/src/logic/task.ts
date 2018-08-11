import { Vec2 } from "./math"

export class Task {
    x: number;
    y: number;
    mask: Array<Array<boolean>>;
    private maskWidth: number;
    private maskHeight: number;
    underСonstruction: boolean;

    constructor(x: number, y: number, mask: Array<Array<boolean>>) {
        this.x = x;
        this.y = y;
        this.mask = mask;
        this.underСonstruction = false;

        this.maskWidth = mask.length;
        this.maskHeight = mask[0].length;
    }

    getNextCell(): Vec2 {
        for (var x = 0; x < this.maskWidth; ++x) {
            for (var y = 0; y < this.maskHeight; ++y) {
                if (this.mask[x][y]) {
                    return new Vec2(this.x + x, this.y + y);
                }
            }
        }
        return null;
    }

    updateMask(cell: Vec2) {
        this.mask[cell.x - this.x][cell.y - this.y] = false;
    }
}
