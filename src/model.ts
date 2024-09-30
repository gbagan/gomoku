export type Adversary = "human" | "level1";

export type Config = {
  width: number,
  height: number,
  adversary: Adversary,
  alignment: number,
}

export type Outcome = { color: number, alignment: [number, number] } | null;

export type State = {
  board: number[],
  turn: number,
  played: number[],
  scores: number[] | null,
  config: Config,
  outcome: Outcome,
  isThinking: boolean,
  dialogOpened: boolean,
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
    scores: null,
    config: newConfig(),
    outcome: null,
    isThinking: false,
    dialogOpened: false,
  };
}

export function hasWon(width: number, height: number, board: number[], alignment: number, color: number, move: number): { color: number, alignment: [number, number] } | null {
  function count(x: number, y: number, dx: number, dy: number): [number, number] {
    let n = 0;
    while (x >= 0 && x < width && y >= 0 && y < height && board[y * width + x] === color) {
      n++;
      x += dx;
      y += dy;
    }
    return [n, x - dx + width * (y - dy)];
  }

  let ix = move % width;
  let iy = move / width | 0;

  for (const [dx, dy] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    const [a, ext1] = count(ix + dx, iy + dy, dx, dy);
    const [b, ext2] = count(ix - dx, iy - dy, -dx, -dy);
    if (a + b >= alignment - 1) {
      return { color, alignment: [ext1, ext2] };
    }
  }
  return null;
}

export function getThreats(width: number, height: number, board: number[], alignment: number, color: number): number[] {
  const res: number[] = [];
  for (let j = 0; j < height; j++) {
    for (let i = 0; i <= width - alignment; i++) {
      const tmp: number[] = [];
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * j + i + k;
        if (board[index] === 3 - color) {
          skip = true;
        } else if (board[index] === 0) {
          tmp.push(index);
        }
      }
      if (!skip && tmp.length === 1 && !res.includes(tmp[0])) {
        res.push(tmp[0]);
      }
    }
  }
  for (let j = 0; j <= height - alignment; j++) {
    for (let i = 0; i < width; i++) {
      const tmp: number[] = [];
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * (j + k) + i;
        if (board[index] === 3 - color) {
          skip = true;
        } else if (board[index] === 0) {
          tmp.push(index);
        }
      }
      if (!skip && tmp.length === 1 && !res.includes(tmp[0])) {
        res.push(tmp[0]);
      }
    }
  }
  for (let j = 0; j <= height - alignment; j++) {
    for (let i = 0; i <= width - alignment; i++) {
      const tmp: number[] = [];
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * (j+k) + i + k;
        if (board[index] === 3 - color) {
          skip = true;
        } else if (board[index] === 0) {
          tmp.push(index);
        }
      }
      if (!skip && tmp.length === 1 && !res.includes(tmp[0])) {
        res.push(tmp[0]);
      }
    }
  }
  for (let j = 0; j <= height - alignment; j++) {
    for (let i = alignment - 1; i < width; i++) {
      const tmp: number[] = [];
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * (j+k) + i - k;
        if (board[index] === 3 - color) {
          skip = true;
        } else if (board[index] === 0) {
          tmp.push(index);
        }
      }
      if (!skip && tmp.length === 1 && !res.includes(tmp[0])) {
        res.push(tmp[0]);
      }
    }
  }
  return res;
}