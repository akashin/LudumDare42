import { CONST, ROBOT_CONST, GRID_CONST } from "../const/const";
import { Vec2 } from "./math"
import { Task } from "./task"

export enum RobotType {
    Engineer,
}

enum RobotState {
    WAITING,
    MOVING,
    WORKING,
}

export class Robot {
    private sprite: Phaser.GameObjects.Sprite;
    private type: RobotType;
    private destinationPoint: Vec2;
    private task: Task;
    private state: RobotState;
    private workTimer: number;

    constructor(scene: Phaser.Scene, x: number, y: number, type: RobotType) {
        let texture: string = "";
        if (type == RobotType.Engineer) {
            texture = "engineer";
        }

        this.type = type;
        this.state = RobotState.WAITING;

        this.sprite = scene.make.sprite({});
        this.sprite.setPosition(
            GRID_CONST.CELL_WIDTH / 2,
            GRID_CONST.CELL_HEIGHT / 2
        );
        this.sprite.setTexture(texture);
        this.sprite.setVisible(false);

        this.sprite.setScale(
            GRID_CONST.CELL_WIDTH / this.sprite.width,
            GRID_CONST.CELL_HEIGHT / this.sprite.height
        );
    }

    addToContainer(container: Phaser.GameObjects.Container) {
        container.add(this.sprite);
        this.sprite.setVisible(true);
    }

    setTask(task: Task) {
        this.task = task;
    }

    update(time: number, delta: number) {
        if (this.task == null) {
            this.state = RobotState.WAITING;
            return;
        }

        let nextCell = this.task.getNextCell();
        if (nextCell == null) {
            this.task = null;
            this.state = RobotState.WAITING;
            return;
        }

        if (this.state == RobotState.WAITING) {
            this.destinationPoint = new Vec2(
                (nextCell.x + 0.5) * GRID_CONST.CELL_WIDTH,
                (nextCell.y + 0.5) * GRID_CONST.CELL_HEIGHT
            );
            this.state = RobotState.MOVING;
        } else if (this.state == RobotState.MOVING) {
            let position = new Vec2(this.sprite.x, this.sprite.y);
            let direction = this.destinationPoint.sub(position);
            let distance = direction.length();
            direction = direction.norm();

            if (distance < 1) {
                this.sprite.x = this.destinationPoint.x;
                this.sprite.y = this.destinationPoint.y;

                this.workTimer = 1.0;
                this.state = RobotState.WORKING;
                return;
            }

            distance = Math.min(distance, ROBOT_CONST.SPEED * delta);
            direction.scale(distance);

            this.sprite.x += direction.x;
            this.sprite.y += direction.y;
        } else if (this.state == RobotState.WORKING) {
            this.workTimer = Math.max(0, this.workTimer - delta);
            if (this.workTimer < 0.01) {
                this.task.updateMask(nextCell);
                this.state = RobotState.WAITING;
            }
        }
    }
}
