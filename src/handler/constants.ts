export const BOARD_SIZE = 9;
export const MINE_COUNT = 10;

// all combinations of [-1, 0, 1]*[-1, 0, 1] except [0,0]
export const ADJACENT_GRID_DELTA = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export enum GAME_STATUS {
  DEFAULT,
  PLAY,
  WIN,
  LOSE,
}

export enum THEME_MAP {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum TOAST_MSG {
  WIN = 'Congratulations! You win 🎉!',
  LOSE = 'Oops, you stepped on a mine 🤕!',
}
