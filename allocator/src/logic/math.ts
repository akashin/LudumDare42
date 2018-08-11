export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    sub(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    scale(c: number): Vec2 {
        return new Vec2(this.x * c, this.y * c);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    norm(): Vec2 {
        let length = this.length();
        return new Vec2(this.x / length, this.y / length);
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

export function randomInt(max: integer) : integer {
    return Math.floor(Math.random() * max);
}
