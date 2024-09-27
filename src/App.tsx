import { Component } from 'solid-js';
import { createStore, produce } from "solid-js/store";
import Board from './components/Board';
import { last } from './util';

const App: Component = () => {
  const width = 15;
  const height = 15;

  const board: number[] = new Array(15 * 15);
  board.fill(0);

  const [state, setState] = createStore({ board, turn: 1, played: [] as number[] });

  const play = (i: number) => {
    setState(produce(state => {
      if (state.board[i] === 0) {
        state.board[i] = state.turn;
        state.turn = 3 - state.turn;
        state.played.push(i);
      }
    }));
  }

  const undo = () => {
    setState(produce(state => {
      if(state.played.length) {
        const move = state.played.pop();
        state.board[move!] = 0;
        state.turn = 3 - state.turn;
      }
    }));
  }

  return (
    <>
      <div class="w-full min-h-screen bg-main bg-cover flex flew-row items-center justify-around portrait:flex-col">
        <Board
          board={state.board}
          width={width}
          height={height}
          lastMove={last(state.played)}
          turn={state.turn}
          play={play}
        />
        <button class="btn" onClick={undo}>Annuler</button>
      </div>
    </>
  )
}

export default App;