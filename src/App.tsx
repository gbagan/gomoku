import { Component } from 'solid-js';
import { createStore, produce } from "solid-js/store";
import Board from './components/Board';
import { delay, last } from './util';
import { computerMove, erdosTable } from './erdos';
import { Config, hasWon, newState } from './model';
import NewGame from './components/NewGame';

const App: Component = () => {
  let newGameDialog!: HTMLDialogElement;

  const [state, setState] = createStore(newState());

  const play = async (i: number) => {
    const width = state.config.width;
    const height = state.config.height;
    let table: number[];
    if (!state.winner && state.board[i] === 0) {
      setState(produce(state => {
        state.board[i] = state.turn;
        state.played.push(i);
        let won = hasWon(width, height, state.board, state.config.alignment, state.turn, i);
        if(won) {
          state.winner = won;
          return;
        }
        if (state.config.adversary !== 'human') {
          state.isThinking = true;
          table = erdosTable(state.config.width, state.config.height, [...state.board], state.config.alignment, state.turn);
          state.scores = table;
        }
        state.turn = 3 - state.turn;
      }));
      if (!state.winner && state.config.adversary !== 'human') {
        await delay(1500);
        setState(produce(state => {
          let j = computerMove(table);
          state.board[j] = state.turn;
          state.played.push(j);
          state.scores = null;
          let won = hasWon(width, height, state.board, state.config.alignment, state.turn, i);
          if(won) {
            state.winner = won;
            return;
          }
          state.turn = 3 - state.turn;
          state.isThinking = false;
        }));
      }
    };
  }

  const undo = () => {
    if (state.isThinking)
      return;

    setState(produce(state => {
      if(state.played.length) {
        const move = state.played.pop();
        state.board[move!] = 0;
        state.turn = 3 - state.turn;
        state.winner = null;
      }
      if(state.played.length && state.config.adversary !== 'human') {
        const move = state.played.pop();
        state.board[move!] = 0;
        state.turn = 3 - state.turn;
      }
    }));
  }

  const openNewGameDialog = () => {
    newGameDialog.showModal();
  }

  const newGame = (config: Config) => {
    setState(produce(state => {
      state.config = {...config};
      state.board = new Array(config.width * config.height);
      state.board.fill(0);
      state.played = [];
      state.winner = null;
      state.turn = 1;
      state.isThinking = false;
    }))
    newGameDialog.close();
  }

  return (
    <>
      <div class="w-full min-h-screen bg-main bg-cover flex flew-row items-center justify-around portrait:flex-col">
        <Board
          board={state.board}
          width={state.config.width}
          height={state.config.height}
          lastMove={last(state.played)}
          turn={state.turn}
          scores={state.scores}
          winner={state.winner}
          canPlay={!state.isThinking && !state.winner}
          play={play}
        />
        <div class="flex flex-col bg-seamless">
          <button class="btn" onClick={openNewGameDialog}>Nouvelle partie</button>
          <button class="btn" onClick={undo}>Annuler</button>
        </div>
      </div>
      <dialog class="dialog" ref={newGameDialog}>
       <NewGame
        config={state.config}
        closeDialog={() => newGameDialog.close()}
        newGame={newGame}
       />
      </dialog>
    </>
  )
}

export default App;