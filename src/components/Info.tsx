import { Component, createMemo, createSignal, onMount } from "solid-js";
import { Transition } from "solid-transition-group";
import { Adversary, Outcome } from "../model";
import { delay } from "../util";

const messages: [string, number][] = [
  ["Bienvenue sur l'appli Gomoku", 4000],
  ["Gomoku connu aussi sous le nom de Darpion est un jeu positionnel.", 5000],
  ["Il existe de nombreuses variantes: Libre, Renju, Caro, Omok, Ninuki-renju", 5000]
]

type InfoComponent = Component<{
  multipleThreats: boolean,
  outcome: Outcome,
  turn: number,
  isThinking: boolean,
  adversary: Adversary,
}>

const Info: InfoComponent = props => {
  const [periodicMessage, setPeriodicMessage] = createSignal<string | null>("");
  
  const message = createMemo(() =>
    props.outcome !== null && props.outcome.color === 0
    ? 'Match nul! Tu peux changer le niveau de difficulté en clickant sur "Nouvelle partie".'    
    : props.outcome !== null
    ? `Le joueur ${props.outcome.color === 1 ? "noir" : "blanc"} a gagné la partie. Tu peux changer le niveau de difficulté en clickant sur "Nouvelle partie".`
    : props.multipleThreats
    ? `Le joueur ${props.turn === 1 ? "blanc" : "noir"} a réussi une menace multiple. Il peut gagner la partie quoique réponde l'adversaire.`
    : periodicMessage()
  )

  const girlExpression = createMemo(() =>
    props.isThinking
    ? "bg-thinking"
    : props.outcome !== null && props.outcome.color === 1 && props.adversary !== 'human'
    ? "bg-crying"
    : props.outcome !== null && (props.outcome.color === 2 || props.adversary === 'human')
    ? "bg-happy"
    : props.multipleThreats
    ? "bg-surprised"
    : "bg-speaking"
  )

  onMount(async () => {
    let i = 0;
    while (true) {
      const d = messages[i][1];
      setPeriodicMessage(messages[i][0]);
      await delay(d);
      setPeriodicMessage(null);
      i = (i + 1) % messages.length;
      await delay(2000);
    }
  })

  return (
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
  )
}

export default Info;