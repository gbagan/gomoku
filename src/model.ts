export type Adversary =  "human" | "level1";

export type Config = {
  width: number,
  height: number,
  adversary: Adversary,
  alignment: number,
}

export type State = {
  board: number[],
  turn: number,
  played: number[],
  scores: number[] | null,
  config: Config,
  winner: number,
  isThinking: boolean,
}

export const newConfig: () => Config = () => ({
  width: 15,
  height: 15,
  adversary: "level1",
  alignment: 5,
});

export const newState: () => State = () => {
  const config = newConfig();
  const board: number[] = new Array(config.width * config.height);
  board.fill(0);
  return {
    board,
    turn: 1,
    played: [],
    scores: [],
    config: newConfig(),
    winner: 0,
    isThinking: false,
};
}

export function hasWon(width: number, height: number, board: number[], alignment: number, color: number, move: number) {
  function count(x: number, y: number, dx: number, dy: number) {
    let n = 0;
    while(x >= 0 && x < width && y >= 0 && y < height && board[y * width + x] === color) {
      n++;
      x += dx;
      y += dy;
    }
    return n;
  }

  let ix = move % width;
  let iy = move / width | 0;
  
  return [[0, 1], [1, 0], [1, 1], [1, -1]].some(([dx, dy]) =>
    count(ix+dx, iy+dy, dx, dy) + count(ix-dx, iy-dy, -dx, -dy) >= alignment - 1
  )
}