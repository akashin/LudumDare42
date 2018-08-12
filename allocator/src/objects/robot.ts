import { CONST, ROBOT_CONST, GRID_CONST } from "../const/const";
import { Vec2 } from "../logic/math"
import { Task } from "../logic/task"

export enum RobotType {
    Engineer,
}

enum RobotState {
    WAITING,
    MOVING,
    WORKING,
}

export class Robot extends Phaser.GameObjects.Sprite {
    private robotType: RobotType;
    private destinationPoint: Vec2;
    private task: Task;
    private state: RobotState;
    private workTimer: number;

    static getTextureName(robotType: RobotType): string {
      if (robotType == RobotType.Engineer) {
        return "engineer";
      }
      return "";
    }

    constructor(scene: Phaser.Scene, x: number, y: number, robotType: RobotType) {
      super(scene,
            x + GRID_CONST.CELL_WIDTH / 2,
            y + GRID_CONST.CELL_HEIGHT / 2,
            Robot.getTextureName(robotType));

      this.robotType = robotType;
      this.state = RobotState.WAITING;

      this.setScale(
        GRID_CONST.CELL_WIDTH / this.width,
        GRID_CONST.CELL_HEIGHT / this.height
      );
    }

    setTask(task: Task) {
      this.task = task;
    }

    update() {
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
        let position = new Vec2(this.x, this.y);
        let direction = this.destinationPoint.sub(position);
        let distance = direction.length();
        direction = direction.norm();

        if (distance < 1) {
          this.x = this.destinationPoint.x;
          this.y = this.destinationPoint.y;

          this.workTimer = 1.0;
          this.state = RobotState.WORKING;
          return;
        }

        distance = Math.min(distance, ROBOT_CONST.SPEED);
        direction.scale(distance);

        this.x += direction.x;
        this.y += direction.y;
      } else if (this.state == RobotState.WORKING) {
        this.workTimer = Math.max(0, this.workTimer - 1);
        if (this.workTimer < 0.01) {
          this.task.updateMask(nextCell);
          this.state = RobotState.WAITING;
        }
      }
    }
}
