import { Component } from "solid-js";
import Emph from "./Emph";

const Rules: Component<{closeDialog: () => void}> = props =>
  <>
    <div class="dialog-title">Règles de Catch the lion</div>
    <div class="dialog-body">
      <ul>
        <li class="list-disc">Gomoku est un jeu à deux joueurs: <Emph>Noir</Emph> et <Emph>Blanc</Emph></li>
        <li class="list-disc">A tour de rôle, un des joueurs place un pion de sa couleur sur une case vide du plateau.</li>
        <li class="list-disc">Le but du jeu est d'<Emph>aligner</Emph> un certain nombre de pions de sa
          couleur, <Emph>horizontalement</Emph>, <Emph>verticalement</Emph> ou en <Emph>diagonal</Emph>.<br/>
            Par défaut, ce nombre est <Emph>5</Emph> mais tu peux le paramétrer entre 3 et 8</li>
        <li class="list-disc">Par défaut, la taille de la grille est 15x15 mais tu peux également la paramétrer.</li>
      </ul>
    </div>
    <div class="dialog-buttons">
      <button class="btn" onClick={props.closeDialog}>OK</button>
    </div>
  </>

export default Rules;