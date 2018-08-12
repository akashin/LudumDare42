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
}
