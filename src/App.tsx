import { Component, createMemo, onMount } from 'solid-js';
import { createStore, produce } from "solid-js/store";
import Board from './components/Board';
import { delay, last } from './util';
import { computerMove, erdosTable } from './erdos';
import { Config, getThreats, hasWon, newState } from './model';
import NewGame from './components/NewGame';
import { Transition } from 'solid-transition-group';

const messages: [string, number][] = [
  ["Bienvenue sur l'appli Gomoku", 4000],
  ["Gomoku connu aussi sous le nom de Darpion est un jeu positionnel.", 5000],
  ["Il existe de nombreuses variantes: Libre, Renju, Caro, Omok, Ninuki-renju", 5000]
]

const App: Component = () => {
  let newGameDialog!: HTMLDialogElement;

  const [state, setState] = createStore(newState());

  const threats = createMemo(() => 
    getThreats(state.config.width, state.config.height, state.board, state.config.alignment, 3 - state.turn)
  )

  const message = createMemo(() =>
    state.winner !== null
      ? `Le joueur ${state.winner.color === 1 ? "noir" : "blanc"} a gagné la partie. Tu peux changer le niveau de difficulté en clickant sur "Nouvelle partie".`
      : threats().length > 1
      ? `Le joueur ${state.turn === 1 ? "blanc" : "noir"} a réussi une menace multiple. Il peut gagner la partie quoique réponde l'adversaire.`
      : state.message
  )

  const girlExpression = createMemo(() =>
    state.isThinking 
    ? "bg-thinking"
    : state.winner !== null && state.winner.color === 1 && state.config.adversary !== 'human'
    ? "bg-crying"
    : state.winner !== null && (state.winner.color === 2 || state.config.adversary === 'human')
    ? "bg-happy"
    : threats().length > 1
    ? "bg-surprised"
    : "bg-speaking"
  )

  const play = async (i: number) => {
    const width = state.config.width;
    const height = state.config.height;
    let table: number[];
    if (state.isThinking || state.winner || state.board[i] !== 0)
      return;

    setState(produce(state => {
      state.board[i] = state.turn;
      state.played.push(i);
      let won = hasWon(width, height, state.board, state.config.alignment, state.turn, i);
      if (won) {
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
        let won = hasWon(width, height, state.board, state.config.alignment, state.turn, j);
        if (won) {
          state.winner = won;
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
        state.winner = null;
      }
      if (state.played.length && state.config.adversary !== 'human') {
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
      state.config = { ...config };
      state.board = new Array(config.width * config.height);
      state.board.fill(0);
      state.played = [];
      state.winner = null;
      state.turn = 1;
      state.isThinking = false;
    }))
    newGameDialog.close();
  }

  onMount(async () => {
    let i = 0;
    while (true) {
      const d = messages[i][1];
      setState("message", messages[i][0]);
      await delay(d);
      setState("message", null);
      i = (i + 1) % messages.length;
      await delay(2000);
    }
  })

  return (
    <>
      <div class="w-full min-h-screen h-full bg-main bg-cover flex flew-row items-center justify-around portrait:flex-col">
        <div class="flex flex-col bg-wood">
          <button class="btn" onClick={openNewGameDialog}>Nouvelle partie</button>
          <button class="btn" onClick={undo}>Annuler</button>
        </div>
        <Board
          board={state.board}
          width={state.config.width}
          height={state.config.height}
          lastMove={last(state.played)}
          turn={state.turn}
          scores={state.scores}
          winner={state.winner}
          threats={threats()}
          canPlay={!state.isThinking && !state.winner}
          play={play}
        />
        <div class={`relative w-[15rem] h-[25rem] bg-contain bg-no-repeat ${girlExpression()}`}>
          <Transition
            onEnter={(el, done) => {
              const a = el.animate([
                { opacity: 0 },
                { opacity: 1 }], {
                duration: 500
              }
              );
              a.finished.then(done);
            }}
            onExit={(el, done) => {
              const a = el.animate([
                { opacity: 1 },
                { opacity: 0 }], {
                duration: 500
              }
              );
              a.finished.then(done);
            }}
          >
            {message() && <div class="tooltip">{message()}</div>}
          </Transition>
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