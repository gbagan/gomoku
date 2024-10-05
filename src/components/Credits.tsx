import { Component } from "solid-js";
import Emph from "./Emph";

const Rules: Component<{closeDialog: () => void}> = props =>
  <>
    <div class="dialog-title">Règles de Catch the lion</div>
    <div class="dialog-body">
      <ul>
        <li class="list-disc">L'application <Emph>Gomoku</Emph> a été écrite par Guillaume Bagan.</li>
        <li class="list-disc">Le code source est sous licence MIT.</li>
        <li class="list-disc">Les différentes images ont été générées par Dall-E.</li>
        <li class="list-disc">Les différents sons proviennent de la plate-forme Lichess.</li>
        <li class="list-disc">Les librairies Solid et Tailwind ont été utilisées.</li>
      </ul>
    </div>
    <div class="dialog-buttons">
      <button class="btn" onClick={props.closeDialog}>OK</button>
    </div>
  </>

export default Rules;