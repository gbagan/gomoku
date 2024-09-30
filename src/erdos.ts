function erdosSelfridge(width: number, height: number, board: number[], alignment: number, color: number): number {
  let score = 0;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i <= width-alignment; i++) {
      let n = 0;
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * j + i + k;
        if (board[index] === color) {
          n++;
        } else if (board[index] === 3 - color) {
          skip = true;
        }
      }
      if (!skip) {
        score += 1 / 2 ** (alignment - n);
      }
    }
  }
  for (let j = 0; j <= height-alignment; j++) {
    for (let i = 0; i < width; i++) {
      let n = 0;
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * (j + k) + i;
        if (board[index] === color) {
          n++;
        } else if (board[index] === 3 - color) {
          skip = true;
        }
      }
      if (!skip) {
        score += 1 / 2 ** (alignment - n);
      }
    }
  }
  for (let j = 0; j <= height-alignment; j++) {
    for (let i = 0; i <= width-alignment; i++) {
      let n = 0;
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * (j + k) + i + k;
        if (board[index] === color) {
          n++;
        } else if (board[index] === 3 - color) {
          skip = true;
        }
      }
      if (!skip) {
        score += 1 / 2 ** (alignment - n);
      }
    }
  }
  for (let j = 0; j <= height-alignment; j++) {
    for (let i = alignment-1; i < width; i++) {
      let n = 0;
      let skip = false;
      for (let k = 0; k < alignment; k++) {
        const index = width * (j + k) + i - k;
        if (board[index] === color) {
          n++;
        } else if (board[index] === 3 - color) {
          skip = true;
        }
      }
      if (!skip) {
        score += 1 / 3 ** (alignment - n);
      }
    }
  }
  return score;
}

export function erdosTable(width: number, height: number, board: number[], len: number, color: number): number[] {
  const n = board.length;
  const table = new Array(n);
  table.fill(Infinity);
  for (let i = 0; i < n; i++){
    if (board[i] === 0) {
      board[i] = 3 - color;
      table[i] = erdosSelfridge(width, height, board, len, color) - erdosSelfridge(width, height, board, len, 3 - color);
      board[i] = 0;
    }
  }

  let min = Math.min(...table);
  let max = Math.max(...table.filter(n => n !== Infinity));

  return table.map(i => i == Infinity ? Infinity : min === max ? 1 : (i - min) / (max - min));
}

export function computerMove(table: number[]): number {
  const n = table.length;
  const min = Math.min(...table);
  const moves = [];
  for (let i = 0; i < n; i++) {
    if (table[i] === min) {
      moves.push(i);
    }
  }
  return moves[Math.random() * moves.length | 0];
}