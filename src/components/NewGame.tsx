import { Component } from "solid-js";
import { Adversary, Config, newConfig } from "../model";
import range from "lodash.range";
import { createStore } from "solid-js/store";

type NewGameComponent = Component<{
  config: Config,
  closeDialog: () => void,
  newGame: (config: Config) => void,
}>

const adversaries = [["human", "Humain"], ["level1", "Débutant"]]

const NewGame: NewGameComponent = props => {
  const [config, setConfig] = createStore({...props.config});

  return (
    <>
      <div class="dialog-title">Nouvelle partie</div>
      <div class="dialog-body grid grid-cols-20/80 gap-8">
        <div class="text-bold text-lg">Adversaire</div>
        <div class="flex gap-4 text-lg">
          {adversaries.map(([name, fullname]) =>
            <button
              class="togglebtn"
              classList={{"toggledbtn": name === config.adversary}}
              onClick={e => setConfig("adversary", name as Adversary)}
            >
              {fullname}
            </button>
          )}
        </div>
        <div class="text-bold text-lg">Alignement</div>
        <div class="flex gap-4">
          {[3, 4, 5, 6, 7, 8].map(i =>
            <button
              class="togglebtn"
              classList={{"toggledbtn": i === config.alignment}}
              onClick={e => setConfig("alignment", i)}
            >
              {i}
            </button>
          )}
        </div>
        <div class="text-bold text-lg">Hauteur</div>
        <div class="grid grid-cols-6 gap-4">
          {range(3, 21).map(i =>
            <button
              class="togglebtn"
              classList={{"toggledbtn": i === config.height}}
              onClick={e => setConfig("height", i)}
            >
              {i}
            </button>
          )}
        </div>

        <div class="text-bold text-lg">Largeur</div>
        <div class="grid grid-cols-6 gap-4">
          {range(3, 21).map(i =>
            <button
              class="togglebtn"
              classList={{"toggledbtn": i === config.width}}
              onClick={e => setConfig("width", i)}
            >
              {i}
            </button>
          )}
        </div>
      </div>
      <div class="dialog-buttons">
        <button class="btn" onClick={props.closeDialog}>Annuler</button>
        <button class="btn" onClick={[props.newGame, config]}>OK</button>
      </div>
    </>
  )
}

export default NewGame;