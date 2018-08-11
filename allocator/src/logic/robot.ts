import { CONST, ROBOT_CONST } from "../const/const";
import { Vec2 } from "./math"

export enum RobotType {
    Engineer,
}

export class Robot extends Phaser.GameObjects.Sprite {
    private robotType: RobotType;
    private destinationPoint: Vec2;

    constructor(scene: Phaser.Scene, x: number, y: number, robotType: RobotType) {
        super(scene, x, y, "engineer");
        this.robotType = robotType;
        scene.add.existing(this);
        this.destinationPoint = new Vec2(x, y);
    }

    setDestinationPoint(x: number, y: number) {
        this.destinationPoint = new Vec2(x, y);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        let position = new Vec2(this.x, this.y);
        let direction = this.destinationPoint.sub(position);
        let distance = direction.length();
        direction = direction.norm();

        if (distance < 1) {
            return;
        }

        distance = Math.min(distance, ROBOT_CONST.SPEED * delta);

        direction.scale(distance);

        this.x += direction.x;
        this.y += direction.y;
    }
}
