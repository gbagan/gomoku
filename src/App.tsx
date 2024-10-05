import { Component, createMemo, onMount } from 'solid-js';
import { createStore, produce } from "solid-js/store";
import Board from './components/Board';
import { delay, last } from './util';
import { computerMove, erdosTable } from './erdos';
import { Config, getThreats, hasWon, newState } from './model';
import NewGame from './components/NewGame';
import Info from './components/Info';
import Rules from './components/Rules';
import Credits from './components/Credits';
const App: Component = () => {
  let dialog!: HTMLDialogElement;
  let moveAudio!: HTMLAudioElement;
  const [state, setState] = createStore(newState());
  const threats = createMemo(() =>
    getThreats(state.config.width, state.config.height, state.board, state.config.alignment, 3 - state.turn)
  )
  const play = async (i: number) => {
    const width = state.config.width;
    const height = state.config.height;
    let table: number[];
    if (state.isThinking || state.outcome || state.board[i] !== 0)
      return;
    moveAudio.play();
    setState(produce(state => {
      state.board[i] = state.turn;
      state.played.push(i);
      let won = hasWon(width, height, state.board, state.config.alignment, state.turn, i);
      if (won) {
        state.outcome = won;
        state.turn = 3 - state.turn;
        return;
      }
      if (state.played.length === state.config.width * state.config.height) {
        state.outcome = { color: 0, alignment: [0, 0] };
        state.turn = 3 - state.turn;
        return;
      }
      state.turn = 3 - state.turn;
      if (state.config.adversary !== 'human') {
        state.isThinking = true;
        table = erdosTable(state.config.width, state.config.height, [...state.board], state.config.alignment, state.turn);
        state.scores = table;
      }
    }));
    if (!state.outcome && state.config.adversary !== 'human') {
      await delay(1500);
      setState(produce(state => {
        let j = computerMove(table);
        moveAudio.play();
        state.board[j] = state.turn;
        state.played.push(j);
        state.scores = null;
        let won = hasWon(width, height, state.board, state.config.alignment, state.turn, j);
        if (won) {
          state.outcome = won;
        } else if (state.played.length === state.config.width * state.config.height) {
          state.outcome = { color: 0, alignment: [0, 0] };
        }
        state.turn = 3 - state.turn;
        state.isThinking = false;
      }));
    };
  }
  const undo = () => {
    if (state.isThinking)
      return;
    setState(produce(state => {
      if (state.played.length) {
        const move = state.played.pop();
        state.board[move!] = 0;
        state.turn = 3 - state.turn;
        state.outcome = null;
      }
      if (state.played.length % 2 === 1 && state.config.adversary !== 'human') {
        const move = state.played.pop();
        state.board[move!] = 0;
        state.turn = 3 - state.turn;
      }
    }));
  }
  const openNewGameDialog = () => {
    setState("dialog", "newgame");
    dialog.showModal();
  }

  const openRulesDialog = () => {
    setState("dialog", "rules");
    dialog.showModal();
  }

  const openCreditsDialog = () => {
    setState("dialog", "credits");
    dialog.showModal();
  }

  const closeDialog = () => {
    dialog.close();
    setState("dialog", null);
  }
  const newGame = (config: Config) => {
    setState(produce(state => {
      state.config = { ...config };
      state.board = new Array(config.width * config.height);
      state.board.fill(0);
      state.played = [];
      state.outcome = null;
      state.turn = 1;
      state.isThinking = false;
      state.dialog = null;
    }))
    dialog.close();
  }
  return (
    <>
      <audio src="./move.webm" preload="auto" ref={moveAudio} />
      <div class="relative w-screen min-h-screen z-20 bg-main bg-cover flex flew-row items-center justify-around portrait:flex-col">
        <div class="absolute bg-white w-full h-full opacity-30 z-10 pointer-events-none" />
        <div class="z-20 flex flex-col bg-wood p-6 border-2 border-black rounded-xl gap-4">
          <div class="text-4xl">Gomoku</div>
          <button class="btn" onClick={openNewGameDialog}>Nouvelle partie</button>
          <button class="btn" onClick={undo}>Annuler</button>
          <button class="btn" onClick={openRulesDialog}>Règles</button>
          <button class="btn" onClick={openCreditsDialog}>Crédits</button>
        </div>
        <Board
          board={state.board}
          width={state.config.width}
          height={state.config.height}
          lastMove={last(state.played)}
          turn={state.turn}
          scores={state.scores}
          outcome={state.outcome}
          threats={threats()}
          canPlay={!state.isThinking && !state.outcome}
          play={play}
        />
        <Info
          multipleThreats={threats().length >= 2}
          outcome={state.outcome}
          turn={state.turn}
          isThinking={state.isThinking}
          adversary={state.config.adversary}
        />
      </div>
      <dialog
        class="dialog"
        ref={dialog}
        onCancel={closeDialog}
        onClose={closeDialog}
      >
        {state.dialog === "newgame"
          ? <NewGame
            config={state.config}
            closeDialog={closeDialog}
            newGame={newGame}
          />
          : state.dialog === "rules"
          ? <Rules closeDialog={closeDialog} />
          : state.dialog === "credits"
          ? <Credits closeDialog={closeDialog} />
          : null
        }
      </dialog>
    </>
  )
}
export default App;