export let CONST = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600
}

// Game grid constants.
export let GRID_CONST = {
  W_CELLS: 10,
  H_CELLS: 5,
  CELL_WIDTH: 30,
  CELL_HEIGHT: 30,
  CELL_BORDER_SIZE: 1,
}

// Conveyor constants.
export let CONVEYOR_CONST = {
  SHAPE_CAPACITY: 5,
  SHAPE_GEN_PERIOD: 100,
  SHAPE_COUNT: 1,
  SHAPE_CELL_WIDTH: 20,
  SHAPE_CELL_HEIGHT: 20,
  SHAPE_COLOR: "0x00FF00",
}

// Robot constants.
export let ROBOT_CONST = {
  SPEED: 50,
}

export let COLOR_CONST = {
  OCCUPIED_HOVER: 0xff0000,
  UNOCCUPIED_HOVER: 0x00ff00,
}

export let SCORE_CONST = {
  B_BOX_W_START: CONST.GAME_WIDTH - CONST.GAME_WIDTH / 3,
  B_BOX_H_START: 16,
  TEXT_COLOR: "#FFFFFF",
  FONT_SIZE: '32px',
  TEXT_FILL: '#000',
  TITLE: "Score: ",
  GRID_CELL_VALUE: 3
}
